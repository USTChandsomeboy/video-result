# FullStop 独立复刻记录

- 仅依据 `../public-input/instruction.md`、`objects.json`、`video-spec.json`、`asset-manifest.json`、给定字体与 `reference.mp4` 独立实现；未读取原作源码、其他案例或评分脚本。
- 观察完整 0–29 秒时间轴，并用连续接触表与关键帧查看圆点、往返画线、沿圆周绘制、球体立体化、玻璃折射、衰减弹跳、蒸发粒子群、旋转点阵地球、回归圆点及片尾逐字文字。
- 浅米色纸面用渐变与 SVG 颗粒生成；页眉、图号、说明与结语保留为 DOM 文字，使用给定 EB Garamond；玻璃底部代码使用给定 JetBrains Mono。
- 圆点、墨线、圆环、球体、红色轨迹、标注采用 SVG；6000 个确定性粒子及其投影阴影使用 Canvas；地球用手写经纬度轮廓采样点阵后投影到球面。所有公开 ID 绑定实际绘制的 DOM/SVG/Canvas 根节点，集合成员由代码独立生成。
- 已运行 `npm run typecheck`，通过；进行了玻璃、粒子群、地球与片尾的静帧运行检查。
- 完整视频只启动一次渲染；保留第一次成功的完整结果。没有评分或质量驱动的第二次完整渲染。

## 渲染命令

工作目录为本 `replica/`。使用现有依赖，没有执行安装。

```sh
PATH='[local artifact]'"$PATH" \
REMOTION_BROWSER_EXECUTABLE='[local artifact]' \
DYLD_LIBRARY_PATH='[local artifact]' \
npx remotion render src/index.tsx Replica output.mp4 --codec=h264 --concurrency=2 --gl=angle > render.log 2>&1
```

Composition：`Replica`；原始规格：1920×1080，60 fps，1740 帧（29 秒）。

## 首次完整结果核验

渲染成功，`render.log` 记录 `Encoded 1740/1740`。最终 `output.mp4`：H.264（avc1），1920×1080，60/1 fps，1740 帧，29.000000 秒，yuvj420p，16,819,663 字节。

使用任务提供的 runtime 已安装 ffprobe 读取最终文件元数据（原指定旧二进制没有及时返回；未因此重渲染）：

```sh
DYLD_LIBRARY_PATH='[local artifact]' \
'[local artifact]' \
-v error -select_streams v:0 \
-show_entries stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,pix_fmt,duration \
-show_entries format=duration,size -of json output.mp4
```
