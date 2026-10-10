# Starry Night：星夜画作揭示

用 Remotion 复刻 reference.mp4，提交完整工程、源码和 output.mp4 到 ../submission。规格：1280×720、30fps、1200 帧。

已有素材位于 assets/，列表见 assets.json。按原路径放入工程 public/ 中使用。视频仅作为参考；需要用可编辑组件实现前景对象和动画。

需要标注的对象：
- painting.main：贯穿全片的星夜画作主体；参考标注 anchors/painting.main.png
- window.foreground：前景窗框；参考标注 anchors/window.foreground.png
- light.trail：移动的光束与尾迹（可含多个层）；参考标注 anchors/light.trail.png
- information.panel：后段左侧画作介绍文字组；参考标注 anchors/information.panel.png

在实际实现对应对象的 HTML/SVG 容器上添加 data-bench-object="对象ID"。集合标在共同容器，可内部拆分。每个对象ID唯一。不要让标注改变画面。对象卡片只用于指认目标，请从视频自行观察布局和动画。

可以用本机 Remotion/ffmpeg 查看帧和渲染。只读取本目录输入和通用工具/依赖。完成复刻后保存初次提交；不做评分或修正版。


提交契约：必须在 `src/Replica.tsx` 中使用命名导出 `export function Replica(...)` 或 `export const Replica = ...`，并在 `src/index.tsx` 中导入该导出，注册 `id="Replica"` 的 Composition。仅在 `registerRoot` 回调中引用未导出的局部函数不符合要求。
