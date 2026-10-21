# Paper Girl 视频复刻

根据 reference.mp4，用 Remotion 复刻完整视频。画布 720×720，24 fps，共 672 帧（28 秒）。观察人物、图形、文字、布局、镜头、转场和动作节奏，并用可编辑的代码完成画面。

素材见 asset-manifest.json，文件已放在空白工程 public/。audio.wav 可直接用作音轨。Patrick Hand 字体已经离线加载。objects.json 给出需要标注的对象名称、大致出现区间和位置；同一对象在不连续镜头中出现时复用同一 ID。

在 src/Replica.tsx 中命名导出 export function Replica()，Composition ID 为 Replica。在实际绘制对象的 DOM/SVG 根节点添加 data-bench-object，值为 objects.json 中的对应 ID。同一帧每个 ID 唯一；对象可嵌套，集合可用一个实际绘图根节点标记，但成员保持可编辑。文字保持文字，人物、纸张、图形和动作由代码生成。

交付完整源码、output.mp4、replication-log.md、render.log。日志简短记录观察到的主要动作和实现方式。完成一次独立实现并渲染，保留首次成功的完整结果；编译、依赖和运行错误可以修复。
