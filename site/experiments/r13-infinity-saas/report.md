# R13：Infinity SaaS 产品演示

## 选片理由

输入 seed 是 `label_state_and_process_binding` 和 `camera_content_binding`，类别是软件演示 / 产品营销。视频包含产品图标开场、产品镜头、日历、Columns、Gantt、List、Table 多个 UI 状态。这些内容可以用 React、CSS、SVG 和文字重建，适合检验界面状态、交互反馈和镜头内容是否绑定。

来源：[Product Demo Video | SaaS Explainer Video | Infinity](https://www.youtube.com/watch?v=ZK-rNEhJIDs)。本地片段是原片前 15 秒，30fps、1280×720、450 帧。

## 当前复刻暴露的问题

- 开场图标和标题的第一帧时间没有对齐，说明模型容易先做“整体淡入”，忽略已有对象的初始状态。
- 产品镜头被简化成固定色块和小面板，镜头变化没有和 UI 内容一起变化。
- 日历、Columns、Gantt、List、Table 的结构可以画出来，但任务文字、鼠标、按钮反馈和细小标签没有保持。
- 9 秒附近参考已经进入 Gantt View，复刻此时仍显示 Columns View，说明多状态视频容易出现切换顺序和持续时间错误。
- 同一个任务在不同视图中没有保持同一对象身份，列表、看板和表格之间像是不同页面的数据。

这条片段适合继续验证 `initial_state_timing`、`camera_content_binding`、`state_transition_order` 和 `ui_identity_continuity`。
