#!/usr/bin/env python3
"""Fetch and verify the exact media declared by the public Pages manifest."""
import argparse
import hashlib
import json
import time
import urllib.request
from pathlib import Path


def main(site):
    manifest = json.loads((site / 'object-contract-v3-media.json').read_text())
    target = site / 'media/object-contract-v3'
    target.mkdir(parents=True, exist_ok=True)
    for item in manifest['files']:
        name, expected = item['name'], item['sha256']
        assert name == expected + '.mp4' and len(expected) == 64
        assert item['url'].startswith('https://github.com/USTChandsomeboy/video-result/releases/download/')
        dest = target / name
        if dest.exists() and dest.stat().st_size == item['bytes']:
            with dest.open('rb') as stream:
                if hashlib.file_digest(stream, 'sha256').hexdigest() == expected:
                    continue
        part = target / (name + '.part')
        for attempt in range(3):
            try:
                request = urllib.request.Request(item['url'], headers={'User-Agent': 'video-result-pages'})
                with urllib.request.urlopen(request, timeout=90) as response, part.open('wb') as output:
                    size = 0; digest = hashlib.sha256()
                    while chunk := response.read(1024 * 1024):
                        size += len(chunk)
                        if size > item['bytes']:
                            raise ValueError('Media exceeded manifest byte size')
                        output.write(chunk); digest.update(chunk)
                assert size == item['bytes'] and digest.hexdigest() == expected, name
                part.replace(dest)
                print(f'verified {name}: {size} bytes', flush=True)
                break
            except Exception:
                part.unlink(missing_ok=True)
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--site', type=Path, default=Path('site'))
    main(parser.parse_args().site)
