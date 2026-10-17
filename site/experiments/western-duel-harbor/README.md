# SUNDOWN · 日落决斗

36 秒西部决斗短片的独立 Remotion 复刻实验。参考和复刻均为 1280 × 720、30 fps、1080 帧。

## 当前结果

- 独立复刻已完成，类型检查通过，完整视频及音轨已核验。
- 对比页面：`http://127.0.0.1:8770/experiments/western-duel-harbor/index.html`。
- 源码评分正在校准；正式分数以 `evidence/replica/scores.json` 为准。

## 输入和提交

原作工程：`~/Code/remotion-explainers/western-duel`，本案例使用其 `out/western_duel.mp4`。

独立复刻 agent 在 Harbor 管理的 Docker 环境中工作，公开输入包括参考视频、212 个对象的编号和锚点、原作音轨、3 个字体，以及空白 Remotion 工程。画面由 agent 使用 React/SVG 独立绘制。标注要求位于 `tasks/reconstruct-motion-western-duel/instruction.md`。

提交工程保存在 `submission/`，入口为 `src/Replica.tsx` 的命名导出 `Replica`，Composition ID 为 `Replica`。成片位于 `media/replica.mp4`。同一成片在提交目录和展示目录使用硬链接。

## 评分

| 维度 | 权重 | 检查内容 |
| --- | ---: | --- |
| 元素存在 | 5% | 实际绘制对象、部件和集合成员是否存在 |
| 元素属性 | 5% | 形状、颜色、文字、尺寸和位置 |
| 相对关系 | 5% | 对象及部件之间的位置关系 |
| 动效绑定 | 15% | 对应部件的相应属性是否随时间变化 |
| 运动参数 | 60% | 轨迹、变化幅度、方向和速度 |
| 进出时序 | 10% | 出现、退出和关键动作的时间 |

权重和容差在复刻提交前确定。逐项检查依据原作建立，并经过原作自对照、等价改写、定向错误和独立复刻校准。评分脚本从两份源码读取最终绘制属性和时间变化。

源码审阅发现的主要差异在 `presentation/review-findings.json`：街道推进、人物登场、枪与特效的连接、关节倒地动作、逐渐眯眼。`presentation/video-comparison.jpg` 展示同一时刻的画面对照。

## 文件位置

| 路径 | 内容 |
| --- | --- |
| `frozen-source/` | 冻结的原作工程 |
| `tasks/reconstruct-motion-western-duel/` | Harbor 任务与公开输入 |
| `verifier/` | 评分脚本、隐藏检查和校准记录 |
| `submission/` | 独立复刻工程和成片 |
| `media/` | 页面使用的参考与复刻视频 |
| `evidence/submission-recovery.json` | 提交文件哈希、视频元数据及收集方式 |
| `evidence/replica/` | 正式评分完成后生成的逐项结果 |
| `authoring/` | 任务生成、公共对象预检查和修订记录 |

## 查看和重新渲染

从 `code/video-seed-bench/` 启动静态服务器后打开对比页面：

```sh
node serve.mjs
```

在 `submission/` 安装锁定依赖，完成类型检查并渲染：

```sh
npm ci
npm run typecheck
npm run render
```

可通过环境变量 `REMOTION_BROWSER_EXECUTABLE` 指定本地 Chromium。生成关键帧对比需要 Python Pillow 和 FFmpeg：

```sh
python3 prepare_presentation.py --ffmpeg /absolute/path/to/ffmpeg
```

## 运行记录

独立 agent 已在原 Harbor 容器中完成渲染。宿主桥接进程在最终收集前退出，因此从保留容器中原样提取了提交，记录见 `evidence/submission-recovery.json`。评分使用该固定提交，正式 Harbor 评分验收另行记录。
