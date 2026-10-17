# 本次补充的复刻案例

入口：[两组视频对比](replicas.html)。首页也有入口。案例支持同步播放、逐帧、慢放和声音切换。

本次仅发布已有成片和已有评分，没有修改复刻源码、视频、评分规则或权重。

| 案例 | 状态 |
| --- | --- |
| 七雄并立 | v2 源码分 55.34；3378/3378 项 |
| SVG 眨眼动画教程 | 源码分 58.65；1338/1338 项 |

## 媒体存储

两组案例共四个完整视频，保存在 GitHub Release `remaining-replicas-media-20261017`，播放器直接读取 Release 地址。媒体按 SHA-256 登记。

Pages 保存展示页、缩略图、评分摘要与压缩证据；视频文件不提交到 Git。其他本次新增案例已从公开列表和独立展示页移除，原始项目与 Release 中的文件保留。

- `remaining-replicas-assets.json`：媒体地址、大小和内容校验值。
- `data/remaining-replicas-catalog.json`：页面使用的案例列表与现有评分。
- `data/remaining-replicas/<id>/`：同时间点缩略图与经过本地路径清理的评分证据。
- `assets/replica-gallery.js`、`assets/replica-gallery.css`：共享展示逻辑和样式。

生成入口为仓库根目录 `publish_remaining_viewer.py`，发布范围固定为上述两例。在安装 `av`、`Pillow` 的 Python 环境运行，传入 `--project`（video-seed-bench）、`--work`（各 standard-work 的父目录）、`--stage`（临时上传目录）。脚本不会执行原作或复刻工程，也不会重新评分。
