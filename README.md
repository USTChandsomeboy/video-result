# Video Result Viewer

这是一个用于查看视频参考片段与 Remotion 复刻结果的展示页面。当前仓库只放一个实际展示例子，但页面保留了多例切换能力；以后增加例子时，只需在 `examples.json` 中增加一条记录，并放入对应的视频和对照图。

## 使用

需要 Node.js 18 或更高版本。本项目只使用 Node.js 内置模块，不需要执行 `npm install` 或 `npm ci`：

```bash
npm run compare
```

然后打开：

```text
http://127.0.0.1:8770/compare.html
```

页面顶部保留下拉框。当前下拉框只有一个“示例”选项；选择其他记录后，页面会自动切换对应的参考视频、复刻视频、对照图和结果说明。

## 文件说明

- `compare.html`：支持多例切换的同步对比页面。
- `examples.json`：展示例子列表和差异数据。
- `examples/knowledge-network/`：当前唯一上传的展示例子。
- `serve.mjs`：本地静态文件服务。

## GitHub Pages 展示

公开站点：<https://ustchandsomeboy.github.io/video-result/>。

- `site/object-contract-v3.html`：三条视频复刻与六维评分。
- `site/experiments/xiaozhen-whale-harbor/index.html`：小镇姑娘 · 鲸鱼娘 MV，34 秒，63.73 分；66 个对象、3,534 项检查全部有结果，原作 Harbor 对照 100 分。
- `site/experiments/lyric-mv-verifier/index.html`：歌词 MV 素材合成 GT 与 SVG 独立重绘，50.3 分，658 项检查；原视频展示版已去除平台标识和导演、监制署名。

新增案例的视频保存在 GitHub Release，页面与评分 JSON 保存在 Git 中。`site/*-media.json` 指定视频的下载地址、字节数和 SHA-256；GitHub Actions 运行 `fetch_scored_media.py` 核验后将视频和页面一起发布至 Pages。视频通过站点同域播放。


- `site/experiments/clawd-dressup-harbor/index.html`：Clawd 换装，9.5秒；v1 82.94分，v2探索性事后重评分54.37分。37个对象、340项检查，保留两版规则与结果。

- [X-Reels：8 条完整视频复刻与最新评分](https://ustchandsomeboy.github.io/video-result/experiments/x-reels-standard/compare.html)：Kinetic、LinkPulse、Showreel、Reel26、FullStop、Horizon、TeamLaunch、SketchDay。页面提供同步对比、总分、分项、源码与检查记录下载。
