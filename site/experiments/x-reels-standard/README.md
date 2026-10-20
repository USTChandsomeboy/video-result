[返回站点首页](../../index.html) · [打开本批视频对比](compare.html)

# X-Reels 视频复刻实验

Reel26、FullStop、Horizon 先提供视频对比总分（58.5 / 43.8 / 71.9），已显示在对比页；计算方法见 [视频对比分数说明](scoring-review/VIDEO-PROVISIONAL.md)。它们的正式源码评分和 Harbor 准入仍保持原状态。

结果目录：`[local artifact] Code 下，避免 Documents 的 iCloud 同步异常。

输入目录：`[local artifact] 8 条视频，保留各自完整时长、1920×1080 分辨率和原始帧率。

## 查看结果

进入本结果目录后运行：

```sh
python3 scripts/serve.py --port 8772
```

打开 http://127.0.0.1:8772/compare.html 。左侧是原视频，右侧是独立复刻；支持同步播放、拖动进度和逐帧查看。

## 实验流程

1. 固定原视频、源码、素材和视频规格，计算 SHA-256。
2. 提供原视频、实际依赖的素材与字体、对象名称/位置和空白 Remotion 工程。
3. 复刻 agent 只做复刻，提交 `export function Replica()`、实际节点上的对象标记和 `output.mp4`。
4. 保留首次成功完整渲染；类型检查、渲染命令与观察记录写入 `replication-log.md`。
5. 作者根据原作源码建立对象对应关系，以元素存在、元素属性、相对关系、动效绑定、运动参数和进出时序六项检查比较复刻代码。
6. 用原作自对照、带标记的等价原作、故意改错的代码和实际复刻四组校准，封存后评分。
7. 根据评分器覆盖和 Harbor 运行验收，分别登记评分状态与任务准入状态。

## 文件位置

每条案例目录包含：

| 路径 | 内容 |
|---|---|
| `public-input/` | 参考视频、原有素材、字体、公开对象清单与任务说明 |
| `reference-source/` | 固定的原作源码，复刻 agent 不读取 |
| `replica/` | 独立复刻源码、output.mp4、render.log、replication-log.md |
| `oracle/` | 保持原作行为的带对象标记代码，用于校准 |
| `evidence/` | 视频时间线、源码测量记录与源码/视频配对证据 |
| `verifier-v3/` | 新版案例评分脚本与固定规则；v2 保留旧规则 |
| `evaluation-v3/` | 新版 scores.json、checks.json 等结果；v2 保留旧分数 |
| `protocol.json` | Composition、输入来源和哈希 |

`cases.json` 是输入清单；`results.json` 是页面读取的最新状态。`scripts/build_viewer.py` 可更新页面。

原视频和已有素材通过硬链接复用，同一文件系统内不重复占用视频空间；本机运行依赖集中在 `[local artifact] package-lock.json。本批全部 8 条复刻结果保存在本目录，未更改输入目录。

## 评分范围

新版 v3 修正了已复现的颜色、二维形状漏检，增加多状态位置、运动方向与动作时序检查。新版规则、校准及前后分数见 [scoring-review/V3-RESULTS.md](scoring-review/V3-RESULTS.md)，旧问题保留在 [scoring-review/REVIEW.md](scoring-review/REVIEW.md)。

权重：元素存在 10%、元素属性 15%、相对关系 15%、动效绑定 20%、运动参数 25%、进出时序 15%。公开输入和权重先固定，具体检查根据原作源码生成；未宣称详细检查在本轮复刻开始前已经全部封存。

评分器对白名单中的 TypeScript/JSX 做数值解析，再用独立 Chromium 测量允许的静态 DOM/SVG 布局。它比较对象的尺寸、颜色、文字、路径、位置分布、透明度和时间变化。匿名集合比较联合分布，不能据此声称逐个粒子身份已经对应。

Canvas、Three.js 与 GLSL 中的复杂绘制需要专门的测量支持。未覆盖项会明确显示原因；存在这些缺口时，不发布完整总分。音频、滤镜的精确外观、精确字形像素与公开对象范围外的背景不计分。

复刻完成、评分完成、Harbor 准入是三个分别记录的状态，不能互相代替。具体进度见页面和各例 JSON。

## Harbor 任务包

`harbor-tasks/` 保存各例任务，包含 instruction、公开输入、空白工程、隐藏规则、原作源码和评分入口。`asset-cache/` 按 SHA-256 共用媒体；任务输入为硬链接。已做结构和素材恢复验证；完整 Harbor 容器 trial 未完成，不能把 draft 任务直接当作已准入的 bench 样本。Three.js/GLSL 案例还需补评分器支持。

## 运行评估

```sh
python3 scripts/run_score.py kinetic
python3 scripts/build_viewer.py
```

运行脚本默认选择最新已封存版本；`--version v2` 可复现旧分数。新版代码独立保存在 `verifier-v3/`；完整评分必须通过原作自对照、等价原作、改错代码和实际复刻四组校准。评分器覆盖范围见 scores.json 的 scope；总分为空代表评估未完成，不能解释为零分。

公开页的检查记录以 `.json.gz` 保存，下载并解压后可读取全部采样数值。
