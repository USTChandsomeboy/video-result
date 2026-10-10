# Object Contract v3：五条视频复刻实验

本轮实验验证两件事：复刻任务能否拿到原作实际使用的素材；生成的 verifier 能否从源码检查“对象是否对应、动效绑在谁身上、动效在什么时间以什么过程变化”。复刻 agent 只收到 `public/` 目录、参考视频、对象卡片和素材清单，不读取原作源码、隐藏规则、评分结果或历史复刻。

## Harbor 输入如何建立

每个案例都有一个独立目录：

```text
<case>/public/
  reference.mp4       # 仅供复刻时观察
  instruction.md      # 任务说明和对象 ID
  objects.json        # 对象卡片、参考时间和标注图
  assets.json         # 原作工程实际使用的素材及 SHA-256
  assets/             # 图片、SVG、字体、音频、视频等
<case>/submission/     # agent 的初次复刻工程和 output.mp4
```

`prepare_public.py` 从原作工程的真实依赖中生成素材清单。视频、图片和音频通过 SHA-256 建立注册表；同一台机器上使用硬链接，任务包不再复制相同的媒体字节。复刻 agent 只需从 `assets/` 读取素材，不能从网络补素材。提交源码须给对象最外层容器加 `data-bench-object="对象ID"`，这样隐藏 verifier 不需要靠文字、颜色或形状猜对象。

## verifier 的执行顺序

1. **按 ID 对象对齐**：隐藏的 `source-objects.json` 保存原作对象的组件、文件和行号；复刻对象必须带相同 ID。检查唯一、可达、非空，缺失或重复直接记为失败。
2. **源码静态解析**：同一份有界 AST 解释器分别读取原作和复刻入口，只允许 JSX、组件调用、SVG 属性、局部变量、插值、有限循环和 Remotion 时间函数。不会导入执行提交工程，也不会调用 LLM。无法安全解析的表达式保留 `unsupported` 和证据。
3. **检查对象外观和绑定**：在相同采样时间，比较对象是否存在、SVG/HTML 属性是否存在，以及 opacity、transform、几何等动效属性是否确实绑定在该对象或其有效祖先上。
4. **检查动效过程**：在每个对象的完整动作窗口取多个时间点，比较起止时间、延迟、持续时间、位置/缩放/透明度曲线和参数。绑定权重比存在性高，过程权重最高。
5. **输出分数和证据**：输出 `scores.json`、`checks.json`、`matches.json`、`diagnostics.json`。每个检查保留源码文件、行号、表达式和采样值，便于解释扣分。

## 固定评分

本轮冻结六项权重：对象存在 10%，元素属性 15%，相对关系 15%，动效绑定 20%，运动参数 25%，进出时序 15%。每条检查用 `error_score` 将误差映射到 0–100；检查未能解析时不擅自改分母，报告中把它列为 `unresolved_or_unsupported`。完整案例只有六个维度都得到可信结果时才输出 `total`；否则只输出 `provisional_total`。

## 四个案例的最新结果

| 案例 | 状态 | 分数 | 已解析/检查数 | 主要信息 |
|---|---:|---:|---:|---|
| 扩散与渗透：粒子运动 | complete | **45.925** | 30/30 | 已校准箭头、渗透膜和粒子集合的对象位置与时间；粒子运动、下方场景进入和箭头退出存在偏差。 |
| Starry Night：星夜画作揭示 | complete | **41.666** | 24/24 | 信息面板的属性/时序、对象关系和部分运动过程没有还原；画作主体仍能匹配。 |
| 秋日邮局：水彩视觉短片 | complete | **35.937** | 27/27 | 对象存在，但多个对象的相对进入顺序、运动曲线和时序偏差较大。 |
| mimo：pipopipo 歌词 MV | complete | **53.066** | 16/16 | 已读取歌词字框完整位置、逐字进出和击打闪光；复刻的歌词轨迹、进出时序和计数缩放存在偏差。 |

Theneo 仍保留在实验清单中，但没有可确认的原作 Remotion 源码，状态为 `not_applicable`，不参与 Code+Video 评分。

分数表示当前复刻在本轮声明的源码检查上的结果，不能解释为视频所有视觉细节都已被评价。入口未导出、原作源码缺失或解析失败都不会伪装成模型能力的 0 分；这些情况会标为 `invalid_submission`、`not_applicable` 或保留 `unsupported`。覆盖率必须和分数一起查看。

## 歌词和粒子检查的校准

- **时间对齐**：歌词参考片段从完整作品第 8 秒开始；粒子参考片段从完整作品第 51 秒开始，对应 Chamber 组件第 2.933 秒。采样已换算到正确的组件时间。
- **对象对齐**：箭头选到箭头的实际节点；下方渗透膜选到该容器内的 11 个膜片；粒子和歌词按整个集合测量，不取一个成员代表全部。
- **动作测量**：歌词沿完整 SVG 变换链计算字框位置，并检查字框进出画面；击打线测量内部发光层，而非一直可见的外层容器。粒子使用密集采样检查集合位置和数量变化。
- **片段范围**：上方扩散容器的首次淡入在提供的片段开始前已经完成。因此本轮保留其存在、属性和时序检查，去掉片段内不适用的两项绑定/过程检查；粒子案例由 32 项变为 30 项。
- **验证**：两条原作分别与自身对照，均为 100 分；额外按源代码公式核对箭头淡入淡出数值及对象应用行号。集合测量回归测试覆盖变换顺序、空对象、静止成员、成员进出、采样边界和默认透明度。

本轮集合运动比较的是归一化的位置分布、数量和进出事件，尚不逐个匹配每个字或每个粒子。外观检查比较源码属性签名，浏览器完整布局、滤镜和最终画面相似度需要另设检查。

## 产物位置

- 统一结果：[summary.json](evaluation-results/summary.json)
- 单案例分数：`evaluation-results/<case>/scores.json`
- 单案例源码检查：`evaluation-results/<case>/checks.json`
- 对象匹配证据：`evaluation-results/<case>/matches.json`
- 解析限制：`evaluation-results/<case>/diagnostics.json`
- 校准验证：[calibration-validation.json](calibration-validation.json)，运行 `python3 experiments/object-contract-v3/validate_calibration.py`
- 重新评分：在项目根目录运行 `python3 experiments/object-contract-v3/run_eval.py`
- 任务输入示例：[diffusion/public](diffusion/public)、[starry-night/public](starry-night/public)、[autumn-post/public](autumn-post/public)、[mimo-pipopipo/public](mimo-pipopipo/public)、[theneo/public](theneo/public)
- 复刻提交：各案例下的 `submission/` 目录
