> 本页面展示同一提交的探索性事后重评分。v2 在旧分数已知后按55分以下目标调整，不是盲测或正式 Bench 成绩。

# Clawd换装：完整9.5秒复刻

用 Remotion 复刻 `/workspace/reference/reference.mp4`。空白工程在 `/workspace/output`。素材清单为 `/workspace/reference/assets.json`；可用素材在 `/workspace/reference/assets/`，并已按原路径放入工程 `public/`。对象卡片见 `/workspace/reference/objects.json`，其标注帧只说明对象身份和位置。

提交完整源码和 `replica/output.mp4`，规格 1280×720、30 fps、285 帧。`src/Replica.tsx` 定义并命名导出 `Replica`；`src/index.tsx` 从该文件导入 Replica，用 `registerRoot` 注册 `id="Replica"` 且 `component={Replica}` 的 Composition。index 保留直接返回 Composition 或 JSX fragment 的注册入口；场景与时间逻辑写在 Replica 及其子组件中。

在实际渲染对象的 HTML/SVG 最外层容器添加唯一 `data-bench-object="对象ID"`；集合标在共同容器，内部成员保留可编辑实现。
- `terminal.frame`：终端窗口与标签栏
- `terminal.command`：终端启动命令
- `terminal.header`：终端欢迎标题和信息
- `terminal.input`：命令输入框和换装文字
- `terminal.hint`：快捷键提示
- `dialog.panel`：开始弹窗面板
- `dialog.title`：弹窗换装开始标题
- `dialog.start`：START按钮
- `clawd.bare`：裸Clawd身体
- `clawd.bare-eyes`：裸Clawd眼睛
- `clawd.incoming-coat`：飞入的黄色雨衣
- `rain.coat`：雨衣Clawd
- `rain.eyes`：雨衣Clawd眼睛
- `rain.umbrella`：红色雨伞
- `rain.helmet`：漂浮太空头盔
- `rain.drops`：雨滴集合
- `space.astronaut`：宇航员Clawd
- `space.eyes`：宇航员Clawd眼睛
- `space.umbrella`：飞走的红色雨伞
- `space.planet`：右上角像素星球
- `space.stars`：星空点阵集合
- `space.sparkles`：三个旋转闪亮星
- `snow.suit`：雪服Clawd
- `snow.eyes`：雪服Clawd眼睛
- `snow.trees`：六棵像素松树
- `snow.flakes`：飘雪集合
- `snow.dinosaur`：雪地小恐龙
- `jungle.suit`：恐龙服Clawd
- `jungle.eyes`：恐龙服Clawd眼睛
- `jungle.dinosaur`：丛林小恐龙
- `jungle.foliage`：丛林树叶和果实
- `jungle.ground`：丛林地面纹理和灌木
- `transition.rain`：进入雨景的粒子爆发
- `transition.space`：进入太空的粒子爆发
- `transition.snow`：进入雪景的粒子爆发
- `transition.jungle`：进入丛林的粒子爆发
- `watermark`：右下角知洲及小z

还原文字、图形、素材、相对关系、动态过程和进出时序。视频用于观察，前景内容与动效由可编辑代码实现。渲染命令：`cd /workspace/output && npm run render`。

对象内的部件用 `data-bench-part="部件名"` 标在实际绘制节点或共同容器。重复成员可使用相同部件名；对象根 ID 保持唯一。
- `terminal.frame`：`window`, `tab`
- `terminal.header`：`logo`, `title`, `account`, `directory`
- `terminal.input`：`frame`, `prompt`, `text`
- `dialog.panel`：`panel`, `title bar`
- `dialog.start`：`button`, `triangle`, `text`
- `clawd.bare`：`body`, `arms`, `feet`
- `clawd.bare-eyes`：`left eye`, `right eye`
- `clawd.incoming-coat`：`coat`, `seam`, `buttons`
- `rain.coat`：`coat`, `face`, `buttons`, `boots`
- `rain.eyes`：`left eye`, `right eye`
- `rain.umbrella`：`canopy`, `handle`, `ribs`
- `rain.helmet`：`shell`, `window`, `antenna`
- `rain.drops`：`individual drops`
- `space.astronaut`：`suit`, `visor`, `panel`, `boots`, `antenna`
- `space.eyes`：`left eye`, `right eye`
- `space.umbrella`：`canopy`, `handle`, `ribs`
- `space.planet`：`body`, `bands`, `rings`
- `space.stars`：`individual stars`
- `space.sparkles`：`left star`, `middle star`, `right star`
- `snow.suit`：`hat`, `face`, `scarf`, `mittens`, `body`
- `snow.eyes`：`left eye`, `right eye`
- `snow.trees`：`individual trees`
- `snow.flakes`：`individual flakes`
- `snow.dinosaur`：`body`, `legs`, `eye`, `teeth`
- `jungle.suit`：`head`, `face`, `belly`, `tail`, `feet`
- `jungle.eyes`：`left eye`, `right eye`
- `jungle.dinosaur`：`body`, `legs`, `eye`, `teeth`
- `jungle.foliage`：`left leaves`, `right leaves`, `fruit`
- `jungle.ground`：`grass`, `shrubs`
- `transition.rain`：`individual particles`
- `transition.space`：`individual particles`
- `transition.snow`：`individual particles`
- `transition.jungle`：`individual particles`
- `watermark`：`name`, `small z marks`

评分范围：自动评分覆盖公开37个对象及部件的存在、几何/文字/颜色/尺寸位置、空间关系、最终绘制节点动效、运动曲线和进出时序；音频相似度、字体字形像素、模糊和光栅抗锯齿不计入源码分数。完整参考片仍须复刻。

实现与标注要求：
- 完整复刻参考视频9.5秒，1280×720、30fps，共285帧。参考成片和锚点只用于观察，不能作为成片、纹理或逐帧图片嵌入提交视频。
- 提交 src/Replica.tsx，必须命名导出 export function Replica；Composition ID 固定为 Replica。提交完整源码与 output.mp4。
- objects.json 中每个ID须唯一地标在实际参与渲染的最外层HTML/SVG节点：data-bench-object="对象ID"。父子对象可嵌套，各自ID仍须唯一。不能把ID放在注释、未使用组件、空节点或无关替代物上。
- 对象卡片的required_parts是绘制部件名称；请在该对象内的实际子节点标 data-bench-part="部件名称"。集合容器只标一个对象ID，每个实际成员另标 data-bench-member="稳定且唯一的成员序号"；成员必须保持独立可编辑几何、位置和动画。
- 提供源工程实际引用的 clawd-dressup.m4a 音轨，可通过 staticFile 引用。其余人物、服装、道具、环境、文字和转场需用可编辑React/SVG/HTML绘制。
- 容器内观察输入位于 /workspace/reference/{reference.mp4,objects.json,anchors,assets}；工程和最终提交位于 /workspace/output。
- data-bench-member 使用任意稳定且唯一的本地成员字符串。集合在公开锚点位置做确定性一一对应，映射锁定后比较整条轨迹，不要求任何特定的原作索引。


评分版本：高精度复刻 v2。六维权重为元素存在5%、元素属性5%、相对关系5%、动效绑定15%、运动参数60%、进出时序10%。运动的归一化误差≤0.03得100，≥0.25得0；时序误差≤1帧得100，≥3帧得0，中间线性计分。这版规则在旧提交完成后用于重评；后续实验应在复刻前固定同一版本。
