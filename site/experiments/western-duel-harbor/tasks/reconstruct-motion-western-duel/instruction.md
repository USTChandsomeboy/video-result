# 西部日落决斗：完整视频复刻

完整复刻提供的36秒影片：1280×720、30fps、1080帧。所有镜头、文字、人物动作和特效均以参考视频为准。

固定提交入口为 src/Replica.tsx，必须使用 export function Replica；Composition ID=Replica。提交完整可编辑React/SVG/HTML源码和带音轨的 output.mp4。

只能把 reference.mp4 与 anchors 当观察材料；不能将成片、截帧或提取出的逐帧视频用作提交画面。源音轨 score.wav 与三份字体可直接复用，其余画面均为代码绘制。

objects.json 中每个 ID 标在实际绘制实例的最外层 HTML/SVG 节点 data-bench-object="ID"。每个 ID 在一帧只出现一次；复用组件需传入当前场景的不同 ID。required_parts 中每个部件标 data-bench-part="部件名"，不能只标整个人物或空容器。

集合与手指、眼睛、枪、帽子、烟雾等独立动作必须保留可编辑部件。集合成员标稳定且本地唯一的 data-bench-member="自选名称"；评估不要求隐藏原作的编号，将按锚点位置确定一一对应并保持整个轨迹配对。不要把不同粒子或不同手指合成一个不可分的成员。

同名语义部件可包多段形状。不存在于当前镜头的可选部件不用添加占位节点；额外装饰应归属所属语义部件。被遮挡的元素保留真实结构和动画。

提供原作实际引用的音轨与Rye、Special Elite、NotoSerifSC字体；NotoSerifSC字体文件支持可变字重，可按画面选择所需字重。

自动源码评分比较公开对象及其部件的实际存在、颜色/文字/几何/尺寸位置、相对关系、最终节点动画绑定、运动轨迹与进出时序。字体字形光栅、抗锯齿、复杂滤镜的逐像素结果和音频波形相似度不计入源码分数，仍需尽力还原成片观感。

容器输入为 /workspace/reference/{reference.mp4,objects.json,anchors,assets}，空白工程位于 /workspace/output。任务目录中的对应路径为 environment/inputs/ 和 environment/starter-project/。

运行：npm ci；npm run typecheck；npm run render。浏览器路径由 REMOTION_BROWSER_EXECUTABLE 提供。

对象部件和成员语义详见 objects.json 的 member_protocol 及每个对象的 required_parts。锚点位置只是方便找到对象；最终外观、动作和切镜应观察完整视频。

公开物料版本：public-r2-corrected-instances。此表已按实际镜头绘制实例纠正，替代旧186对象表。编号的相同图层按照同一镜头中的绘制次序区分，锚点及 bbox 仅供定位。独立运动成员保持可编辑身份；已融合的静态装饰轮廓可按 member_protocol.fused_shapes 保留。
