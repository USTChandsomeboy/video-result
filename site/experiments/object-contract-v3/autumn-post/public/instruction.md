# 秋日邮局：水彩视觉短片

用 Remotion 复刻 reference.mp4，提交完整工程、源码和 output.mp4 到 ../submission。规格：768×432、30fps、1113 帧。

已有素材位于 assets/，列表见 assets.json。按原路径放入工程 public/ 中使用。视频仅作为参考；需要用可编辑组件实现前景对象和动画。

需要标注的对象：
- airmail.planes：VIA AIR MAIL 场景中飞行的纸飞机集合；参考标注 anchors/airmail.planes.png
- maple.hero：酒红色卡片中央的大枫叶；参考标注 anchors/maple.hero.png
- stamps.group：多枚散落邮票集合；参考标注 anchors/stamps.group.png
- letter.card：信纸和逐步绘出的横线；参考标注 anchors/letter.card.png
- mailbox.assembly：由部件组装成的邮筒主体；参考标注 anchors/mailbox.assembly.png

在实际实现对应对象的 HTML/SVG 容器上添加 data-bench-object="对象ID"。集合标在共同容器，可内部拆分。每个对象ID唯一。不要让标注改变画面。对象卡片只用于指认目标，请从视频自行观察布局和动画。

可以用本机 Remotion/ffmpeg 查看帧和渲染。只读取本目录输入和通用工具/依赖。完成复刻后保存初次提交；不做评分或修正版。


提交契约：必须在 `src/Replica.tsx` 中使用命名导出 `export function Replica(...)` 或 `export const Replica = ...`，并在 `src/index.tsx` 中导入该导出，注册 `id="Replica"` 的 Composition。仅在 `registerRoot` 回调中引用未导出的局部函数不符合要求。
