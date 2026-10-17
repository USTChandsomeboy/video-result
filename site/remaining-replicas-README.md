# 本次补充的复刻案例

入口：[17组视频对比](replicas.html)。首页也有入口。案例支持同步播放、逐帧、慢放和声音切换。

本次仅发布已有成片和已有评分，没有修改复刻源码、视频、评分规则或权重。

| 案例 | 状态 |
| --- | --- |
| 七雄并立 | v2 源码分 55.34；3378/3378 项 |
| SVG 眨眼动画教程 | 源码分 58.65；1338/1338 项 |
| Mercury Hub Trailer | v2 源码分 75.95；532/532 项 |
| Rome Epic | 正式总分为空；已测部分诊断分 53.33，加权覆盖 65.05% |
| AI Automation Commercial | 评分未完成；653/2317 项已解析 |
| Western Duel | 完整成片已完成；评分校准中 |
| Bloomberg、Zeed、Framer、JHU、Apple Motion、Skrrt | 六组历史成片，仅视频对比 |
| 是谁还没用上 Claude | 完整故事成片，仅视频对比 |
| KICKS 拼贴动画 | 仅视频对比；沿用原页面的右侧裁切 |
| 小熊与兔子歌词MV | 历史角色替换版本；参考展示复用去标识与去署名版本 |
| Motion Lab 原帖与首次复刻 | 仅视频对比；与后来的 Harbor 复刻为两次不同实验 |
| Clawd 原帖与首次复刻 | 仅视频对比；与后来的 Harbor 复刻为两次不同实验 |

“仅视频对比”表示没有对应的自动评分，不表示零分。罗马史的已测部分分数也不作为完整总分。

## 媒体存储

完整成片保存在 GitHub Release `remaining-replicas-media-20261017`，播放器直接读取 Release 地址。按 SHA-256 识别重复文件，复用已发布版本。34 个媒体引用中，31 个本次新增，3 个复用旧 Release。

本批视频约 531 MB，直接托管到 Release，避免让 Pages 构建产物超过容量。Pages 只保存展示页、缩略图、评分摘要与压缩证据；视频文件不提交到 Git。

- `remaining-replicas-assets.json`：媒体地址、大小和内容校验值。
- `data/remaining-replicas-catalog.json`：页面使用的案例列表与现有评分。
- `data/remaining-replicas/<id>/`：同时间点缩略图与经过本地路径清理的评分证据。
- `assets/replica-gallery.js`、`assets/replica-gallery.css`：共享展示逻辑和样式。

生成入口为仓库根目录 `publish_remaining_viewer.py`。在安装 `av`、`Pillow` 的 Python 环境运行，传入 `--project`（video-seed-bench）、`--work`（各 standard-work 的父目录）、`--stage`（临时上传目录）。脚本不会执行原作或复刻工程，也不会重新评分。
