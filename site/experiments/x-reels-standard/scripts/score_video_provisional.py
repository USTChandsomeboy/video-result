"""Deterministic video-only fallback for cases lacking source measurement.

Reads delivered MP4s; does not execute projects, render submissions, or change
formal verifier outputs. Numbers are comparable only within this fallback.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from scipy.ndimage import binary_dilation, gaussian_filter

ROOT = Path(__file__).resolve().parents[1]
import imageio_ffmpeg
FFMPEG = Path(os.environ.get('VIDEO_SCORE_FFMPEG', imageio_ffmpeg.get_ffmpeg_exe()))
WIDTH, HEIGHT, FPS = 480, 270, 10
WEIGHTS = {'structure': .50, 'color': .25, 'motion': .25}
VERSION = 'video-provisional-1.0'


def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''): h.update(b)
    return h.hexdigest()


def gray(a):
    return a @ np.array([.2126, .7152, .0722], dtype=np.float32)


def foreground(a):
    border = np.concatenate([a[:5].reshape(-1, 3), a[-5:].reshape(-1, 3), a[:, :5].reshape(-1, 3), a[:, -5:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    return np.max(np.abs(a - bg), axis=2) > .06


def ssim_map(a, b):
    a, b = gray(a), gray(b)
    ma, mb = gaussian_filter(a, 1.5), gaussian_filter(b, 1.5)
    va = np.maximum(0, gaussian_filter(a*a, 1.5) - ma*ma)
    vb = np.maximum(0, gaussian_filter(b*b, 1.5) - mb*mb)
    cov = gaussian_filter(a*b, 1.5) - ma*mb
    return np.clip(((2*ma*mb + .01**2)*(2*cov + .03**2)) / ((ma*ma+mb*mb+.01**2)*(va+vb+.03**2)), 0, 1)


def spatial(a, b):
    mask = binary_dilation(foreground(a) | foreground(b), iterations=2)
    structure = ssim_map(a, b)
    color = 1 - np.abs(a - b).mean(axis=2)
    def pool(x):
        # Explicitly reserve 85% for foreground so empty backgrounds cannot
        # overwhelm a small moving subject. The remaining 15% checks the canvas.
        return float(.85*x[mask].mean()+.15*x.mean()) if mask.any() else float(x.mean())
    return pool(structure), pool(color), float(mask.mean())


def motion_errors(a, b, previous_a, previous_b):
    da, db = a - previous_a, b - previous_b
    return float(np.abs(da-db).sum(dtype=np.float64)), float((np.abs(da)+np.abs(db)).sum(dtype=np.float64))


def aggregate(rows):
    structure = float(np.mean([x['structure'] for x in rows]))
    color = float(np.mean([x['color'] for x in rows]))
    energy = sum(x.get('motion_energy', 0) for x in rows)
    error = sum(x.get('motion_error', 0) for x in rows)
    motion = max(0., min(1., 1-error/energy)) if energy > 1e-6 else None
    dims = {'structure': structure*100, 'color': color*100, 'motion': None if motion is None else motion*100}
    used = sum(WEIGHTS[k] for k,v in dims.items() if v is not None)
    return sum(WEIGHTS[k]*v for k,v in dims.items() if v is not None)/used, dims


def open_video(path, duration, log):
    return subprocess.Popen([str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-threads', '1', '-i', str(path), '-an', '-sn', '-t', str(duration), '-vf', f'setpts=PTS-STARTPTS,fps={FPS}:start_time=0,scale={WIDTH}:{HEIGHT}:flags=area', '-threads', '1', '-pix_fmt', 'rgb24', '-f', 'rawvideo', 'pipe:1'], stdout=subprocess.PIPE, stderr=log)


def read_frame(pipe):
    size = WIDTH*HEIGHT*3
    data = bytearray()
    while len(data) < size:
        b = pipe.read(size-len(data))
        if not b: break
        data.extend(b)
    if not data: return None
    if len(data) != size: raise RuntimeError('Partial decoded frame')
    return np.frombuffer(data, dtype=np.uint8).reshape(HEIGHT, WIDTH, 3).astype(np.float32)/255


def evaluate(slug):
    case = ROOT/slug
    protocol = json.loads((case/'protocol.json').read_text())
    co = protocol['composition']; duration = co['durationInFrames']/co['fps']
    ref, rep = case/'public-input/reference.mp4', case/'replica/output.mp4'
    out = case/'evaluation-video-provisional'; out.mkdir(exist_ok=True)
    hashes = {'reference_video_sha256': sha(ref), 'replica_video_sha256': sha(rep), 'scorer_sha256': sha(Path(__file__)), 'ffmpeg_sha256': sha(FFMPEG)}
    rows = []; previous_a = previous_b = None
    with tempfile.TemporaryFile() as la, tempfile.TemporaryFile() as lb:
        pa, pb = open_video(ref,duration,la), open_video(rep,duration,lb)
        try:
            while True:
                a, b = read_frame(pa.stdout), read_frame(pb.stdout)
                if a is None or b is None:
                    if a is not None or b is not None: raise RuntimeError('Decoded durations differ')
                    break
                st, col, area = spatial(a,b)
                row = {'time_seconds': len(rows)/FPS, 'structure': st, 'color': col, 'foreground_fraction': area}
                if previous_a is not None:
                    row['motion_error'], row['motion_energy'] = motion_errors(a,b,previous_a,previous_b)
                rows.append(row); previous_a,previous_b = a,b
            codes = [pa.wait(), pb.wait()]
            if any(codes):
                la.seek(0);lb.seek(0);raise RuntimeError((la.read()+lb.read()).decode(errors='replace'))
        finally:
            for p in [pa,pb]:
                if p.poll() is None: p.kill(); p.wait()
    assert len(rows) == round(duration*FPS), (len(rows), duration)
    total,dims = aggregate(rows)
    chunks=[]
    for start in range(0,len(rows),FPS):
        score, ds = aggregate(rows[start:start+FPS])
        chunks.append({'start_seconds':start/FPS,'end_seconds':min(duration,(start+FPS)/FPS),'score':score,'dimensions':ds})
    result = {'status':'provisional_video', 'version':VERSION, 'case':slug, 'total':total, 'dimensions':dims,'weights':WEIGHTS,'basis':'delivered-video-only','duration_seconds':duration,'sampling':{'fps':FPS,'width':WIDTH,'height':HEIGHT,'frames':len(rows),'alignment':'original timestamps from zero; no best-match retiming'},'source_evaluation':{'path':'../evaluation-v2/scores.json','status':'incomplete','used_in_total':False},'scope':'暂定视频分：比较已有成片的画面结构、RGB 颜色和运动变化；没有验证 3D、材质、着色器或源码绑定。与 v3 六维源码分数使用不同方法。','motion_definition':'1 - sum(abs(delta_ref - delta_rep)) / sum(abs(delta_ref) + abs(delta_rep)); RGB signed frame differences; global motion-energy pooling','spatial_definition':'SSIM on luminance; 1 - normalized RGB mean absolute error; each pools 85% union foreground and 15% full canvas','provenance':hashes,'dependencies':{'numpy':np.__version__,'scipy':__import__('scipy').__version__},'per_second':chunks}
    (out/'scores.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    (out/'checks.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'case':slug,'total':total,'dimensions':dims,'frames':len(rows)},ensure_ascii=False),flush=True)
    return result


def selftest():
    a=np.zeros((HEIGHT,WIDTH,3),dtype=np.float32); a[80:150,100:200,0]=1
    b=a.copy(); b[80:150,100:200]=[0,0,1]
    c=np.roll(a,20,axis=1)
    st,col,_=spatial(a,a); assert abs(st-1)<1e-6 and abs(col-1)<1e-6
    wrong_st,wrong_col,_=spatial(a,b); assert wrong_st<st and wrong_col<col
    move_st,move_col,_=spatial(a,c); assert move_st<st and move_col<col
    err,energy=motion_errors(c,c,a,a); assert err==0 and energy>0
    err,energy=motion_errors(c,a,a,a); assert abs(1-err/energy)<1e-6
    err,energy=motion_errors(c,a,a,c); assert abs(1-err/energy)<1e-6
    result={'identity_spatial':{'structure':100*st,'color':100*col},'wrong_color':{'structure':100*wrong_st,'color':100*wrong_col},'shift_20_pixels':{'structure':100*move_st,'color':100*move_col},'identity_motion':100,'frozen_motion':0,'reversed_motion':0,'passed':True}
    (ROOT/'scoring-review/video-provisional-selftest.json').write_text(json.dumps(result,indent=2)+'\n')
    print('Self-test passed:',json.dumps(result),flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('cases',nargs='*');args=parser.parse_args()
    selftest()
    for slug in args.cases: evaluate(slug)
