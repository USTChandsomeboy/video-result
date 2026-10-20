# TeamLaunch 独立复刻日志

## 公开输入与观察
- 已完整读取 `../public-input/instruction.md`、`objects.json`、`asset-manifest.json`、`video-spec.json`。仅使用这些公开输入和 `reference.mp4`；素材仅包含提供的字体。
- 参考视频元数据：1920×1080，60 fps，2988 帧，49.8 秒，H.264，无音频流。
- 使用 ffmpeg 提取全片 2 fps 接触表，逐一观察 4 张接触表；继续提取全片 6 fps 动作接触表及关键时刻原尺寸帧，用于观察快速切换、缩放、滚动和消息出现顺序。
- 观察命令：`ffmpeg -i ../public-input/reference.mp4 -vf 'fps=2,scale=480:270,tile=5x5' -vsync 0 observations/sheet-%02d.jpg`；`ffmpeg -i ../public-input/reference.mp4 -vf 'fps=6,scale=384:216,tile=8x5' -fps_mode passthrough observations/motion-%02d.jpg`；关键帧由 `ffmpeg -ss <秒> -i ../public-input/reference.mp4 -frames:v 1` 提取。
- ffprobe 使用 `../../runtime/node_modules/@remotion/compositor-darwin-arm64/ffprobe`，并将 `DYLD_LIBRARY_PATH` 设为该目录。

## 初步动作记录
- 0–3s：绿色背景、雾化白边，Add a new 与右侧职位胶囊纵向滚动，背景巨型淡字。
- 3–5.8s：白色提示词面板缩远，输入 pottery studio 需求；点击绿色上箭头后切入深绿 planning / STRATEGY / build。
- 5.8–8.2s：巨型 SKETCH 文字及编辑选框、蓝色 Noor 标签，切回白底 then。
- 8.5–11.2s：纵排软件卡片与聊天通知依次出现，后续 AI teammate 工作结果。
- 11.2–16.9s：Better than 99% of experts、ready for any Launch / Task；彩色人物圆标缩放移动。
- 16.9–22.5s：12 个彩色圆形人物围成旋转圆环，红色负成本递增。
- 22.5–27.8s：同心圆收束 Hivemint，协作聊天界面入场并推近，消息和设计图依次出现。
- 27.8–31.3s：漂浮 Payroll 卡片围绕 Your AI crew never sends an invoice，卡片金额增长。
- 31.2–36.4s：手机通知转入聊天跟进，提示词面板拖入蜡烛图片，随后显示蜡烛商品制作网页。
- 36.4–42.4s：金币旋转漂浮与 fortunes 文案，You get it all for $0；深绿全屏 $0。
- 42.4–49.8s：Your tireless AI crew / is eager to begin 与职位胶囊；白底 Hivemint 和 What should we make today? 输入框，光标点击。

## 实现
- 完整观察了 8 张 6 fps 全片动作接触表（0–49.8 秒）和 62 个选定时刻关键帧。所有观察文件保存在 `observations/`。
- 以视频实际画面为准细化切换：7.48s 进入 SKETCH，13.55s 进入 Better than，16.92s 进入单人物圆标，18.45s 进入人物环。公开 objects 中时间范围为大致提示。
- 使用 React DOM、SVG 与 Remotion 帧驱动时间构建全部图形：四瓣 Hivemint 标志、渐变人物头像、矢量蜡烛瓶、金币和光标均为代码绘制；聊天、产品网页、卡片与文字保持可编辑。
- 动作由三次缓出、平滑插值、逐字符显示和确定性三角函数生成，包含滚动、推近、卡片入场、金额增长、消息揭示、硬切和星形遮挡转场。
- `src/Replica.tsx` 保留 `export function Replica()`；`src/index.tsx` 使用 Composition `Replica`、1920×1080、60 fps、2988 帧。18 个公开对象 ID 分别绑定到对应真实绘制节点。
- 未读取私有源码、oracle、planned objects、evidence、verifier 或其他案例，未自行评分，未调用子 agent。
- 实现限制：公开素材只有字体，商品、头像及界面全部独立重绘，照片般纹理使用矢量渐变近似；参考无音频，因此输出为静音视频。

## 验证与渲染命令
- `PATH=[local artifact] npm run typecheck`
- 首次正式全片渲染使用 Remotion CLI，H.264，concurrency=2，指定已提供 Chrome 路径；完整标准输出与错误输出保存至 `render.log`。
- 类型检查结果：两次 `tsc --noEmit` 均退出码 0；第二次日志保存在 `typecheck.log`。为避免扫描无关 Three 类型，tsconfig 显式限定 `types` 为 react/react-dom。
- 渲染命令：`PATH=[local artifact] REMOTION_BROWSER_EXECUTABLE=[local artifact] npm run render > render.log 2>&1`。
- 第一次渲染启动失败：Chrome 连接超过内部 25000 ms，未生成 output.mp4；日志保存在 `render-attempt-1.log`。确认同一路径 Chrome `--version` 可成功运行（149.0.7790.0）后重试。没有改动场景源码。
- 静态交付核对：公开对象共 18 个，源码绑定共 18 个，没有缺失 ID。该核对仅检查对象命名交付契约，不进行视觉评分。
- 渲染前源码摘要保存在 `source-sha256.txt`，完整成功后不再修改场景实现。

## 首次成功结果
- 第二次启动完成首个成功全片，Remotion 退出码 0，Rendered / Encoded 2988 / 2988。output.mp4 为 10,920,107 字节。成功后未修改场景源码、未重渲染。
- ffmpeg 全片解码 `ffmpeg -v error -i output.mp4 -f null - > decode-check.log 2>&1` 退出码 0，decode-check.log 为空。
- 输出计划规格 1920×1080、60 fps、2988 帧、49.8 秒、H.264、无音轨。新 ffprobe 对参考已成功核验同规格；成片元数据读取遇 iCloud compressed/dataless 文件恢复阻塞，因此 output-metadata.json 当前为空，待本地文件恢复后精核。
- 首次启动失败记录 render-attempt-1.log，成功完整渲染记录 render.log，类型检查记录 typecheck.log，源码摘要 source-sha256.txt。
