# Reel26 视频复刻

根据 reference.mp4，用 Remotion 复刻完整视频。画布 1920×1080，60 fps，共 900 帧。观察整段视频及关键动作，保持画面内容、图形、文字、布局、材质、镜头、转场和动作节奏。

已有素材见 asset-manifest.json，文件在空白工程 public/。字体已在入口加载，按 font_face.family 使用。objects.json 提供对象 ID、名称和视频中的大致出现区间。

在 src/Replica.tsx 中命名导出 export function Replica()，Composition ID 为 Replica。在实际绘制对象的 DOM/SVG 根节点添加 data-bench-object，值为 objects.json 中的对应 ID；同一帧每个 ID 唯一。集合保持成员可编辑，文字保持文字，图形和动效由代码生成。三维对象可在实际 Canvas 或其可见容器标注对应 ID。

交付完整源码、output.mp4、replication-log.md、render.log。复刻日志简短记录观察到的动作和实现方式。完成一次独立实现并渲染，保留首次成功的完整结果；编译、依赖和运行错误可以修复。
