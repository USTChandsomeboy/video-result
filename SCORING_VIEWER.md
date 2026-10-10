# 复刻视频与评分展示

在线页面：https://ustchandsomeboy.github.io/video-result/object-contract-v3.html

本页展示四个已有完整源码评分的案例：粒子运动 45.925，星夜 41.666，秋日邮局 35.937，pipopipo 歌词 MV 53.066。原作与首次复刻可同步播放，支持逐帧、对象时间定位、六项评分与源码检查证据。

## 文件与部署

- `site/object-contract-v3.html` 和 `site/index.html`：展示页面。
- `site/experiments/object-contract-v3/`：评分、检查证据、对象卡片和复刻源码。
- `site/object-contract-v3-media.json`：视频 URL、字节数和 SHA-256。
- `fetch_scored_media.py`：部署前下载并校验八条视频。
- `.github/workflows/pages.yml`：推送 main 后自动部署 GitHub Pages。

视频存放在 Release `object-contract-v3-media-20261009`，文件名为 SHA-256。Git 仓库仅保存媒体清单；Actions 将媒体放进 Pages 部署包，以同域路径播放。相同视频共用同一个文件。

更新页面：从实验目录导出最新评分及页面；视频变化时先发布新的媒体 Release，再更新清单。提交 main 后查看 Deploy video comparison viewer 工作流，成功后打开在线页面核对。

评分仅覆盖本轮声明的源码检查，具体检查范围见 `site/experiments/object-contract-v3/README.md`。历史对比页继续保留在 `compare.html`。
