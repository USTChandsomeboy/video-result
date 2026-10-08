# 第七轮复刻结果与核验记录

目标是五类各选五条进行首次复刻。这里的“主选”是本轮实验安排，不等于已确认的高难 groundtruth。是否进入正式 bench，需要再排除低难度、素材条件不齐和执行不规范的条目。

输入均为本地参考片段；子 agent 仅做 Remotion 复刻。主 agent 负责选片与差异观察。不制作视觉修正版，不同步飞书。

## 实际数量

| 类别 | 本轮主选 | 已渲染 | 已对照画面 |
|---|---:|---:|---:|
| 产品营销 | 5 | 5 | 5 |
| 品牌形象 | 5 | 5 | 5 |
| 软件演示 | 5 | 5 | 5 |
| 知识讲解 | 5 | 5 | 5 |
| 数据叙事 | 5 | 5 | 5 |

## 本轮主选清单

| 类别 | 视频及原片区间 | 对比 | 条件 / 问题 |
|---|---|---|---|
| 产品营销 | [AXIS：附件拖入与发送](https://vimeo.com/1197944203)：10–25.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-product-axis-dashboard) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 产品营销 | [Selector：产品网站逐屏展示](https://vimeo.com/1174984947)：8.0–23.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-product-selector) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 产品营销 | [Masterworks：动字、几何与手机](https://vimeo.com/1166099508)：0.0–15.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-product-masterworks) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 产品营销 | [Empromptu：输入到应用图解](https://vimeo.com/1129827690)：12.0–27.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-product-empromptu) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 产品营销 | [Connect：四组服务卖点](https://vimeo.com/1117678537)：17.0–32.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-product-connect) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 品牌形象 | [SIMOTECH：字形构造与重组](https://vimeo.com/1135236365)：17.0–32.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-brand-simotech) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 品牌形象 | [TREAVI GET：斜条揭示 Logo](https://vimeo.com/1153505254)：0.0–3.8 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-brand-clean-logo) | 首次实现含 SVG transform 字符串错误，造成 Logo 跑到左上。保留失败输出；不能据此证明素材的动效难度高。 |
| 品牌形象 | [eage：分叉图形与字标](https://vimeo.com/1052594105)：2.5–9.5 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-brand-eage) | 原片内部有神经网络纹理，轮廓与字形可研究；纹理不一致单独记录。 |
| 品牌形象 | [Lynx：笔画组合与切片](https://vimeo.com/1225162242)：0.0–5.8 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-brand-lynx) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 品牌形象 | [EconoLucid：遮罩中的字形组合](https://vimeo.com/1196609736)：0.0–4.9 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-brand-econolucid) | 短片结构较少，难度尚未证实；暂作对照，不能认定为高难 groundtruth。 |
| 软件演示 | [Theneo：搜索、代码与协作](https://vimeo.com/1017420361)：23.0–38.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-software-theneo-api-docs) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 软件演示 | [CooWe：日历预约与隐私展示](https://vimeo.com/1135305347)：48.0–63.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-software-coowe) | 原片有显著制作方水印；可研究 UI 时序，但不宜直接作为干净的最终发布样本。 |
| 软件演示 | [Dashboard：卡片组成仪表盘](https://vimeo.com/1120414884)：9.6–15.1 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-software-dashboard-build) | 5.5 秒界面构建片段；主要考验透视与多组件入场，操作因果较弱。 |
| 软件演示 | [Quick Start：代码更新文档](https://vimeo.com/1087473598)：0.0–15.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-software-quickstart) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 软件演示 | [手机 Onboarding：多页切换](https://vimeo.com/398108811)：0.0–9.8 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-software-onboarding) | 竖屏保留黑边；页面数量有限，是否足够难需后续确认。 |
| 知识讲解 | [Curriculum：分散卡片组成面板](https://vimeo.com/995434094)：45.0–60.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-knowledge-curriculum) | 解释教育产品流程，类别与产品介绍有交叉；人物插画差异与状态转场分开看。 |
| 知识讲解 | [Spancrete：施工机械与日历](https://vimeo.com/224364867)：128.0–143.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-knowledge-spancrete) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 知识讲解 | [疏散教学：逐项放大和强调](https://vimeo.com/1054479067)：16.0–31.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-knowledge-evacuation) | 局部矢量人物需重绘；分析主要关注步骤强调、缩放及背景状态。 |
| 知识讲解 | [动画制作：插画、动画与声音](https://vimeo.com/801619176)：32.0–47.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-knowledge-motion-process) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 知识讲解 | [智慧城市：地图照明与提示](https://vimeo.com/151133356)：32.0–47.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-knowledge-smart-city) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 数据叙事 | [包装比较：水耗与排放](https://vimeo.com/1082562404)：24.0–39.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-data-cyphers) | 已完成首次输出；高难程度和跨类别稳定性仍需进一步确认。 |
| 数据叙事 | [多国疫情数据：动态排名](https://vimeo.com/401968437)：94.0–109.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-data-covid-ranking) | 只比较原片中的图表表达，数值是历史原片内容；输出采用关键帧插值，没有原始逐日数据。 |
| 数据叙事 | [Market Music：环形股票柱图](https://vimeo.com/83191373)：85.0–100.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-data-market-music) | 几何可代码表达，原始每日数据未提供；柱高差异与镜头/标签角度差异分开记录。 |
| 数据叙事 | [市场份额饼图与三年曲线](https://vimeo.com/93873684)：30.0–45.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-data-chart-sequence) | 示例数据图表，属于可视化动效；不代表数字事实已核实。 |
| 数据叙事 | [伦敦到摩洛哥：路线与里程](https://vimeo.com/1092713718)：10.0–25.0 秒 | [播放对比](http://127.0.0.1:8770/compare.html#r07-data-london-route) | 条件样本：地图底图和地形素材未统一，不能把纹理差异视为动效 weakness。 |

## 扩展、对照与排除记录

| 状态 | 视频 | 原因 |
|---|---|---|
| extension | [Moonlight：逐字景深与遮挡](http://127.0.0.1:8770/compare.html#r07-lyric-moonlight) | 仅检查视觉复刻；输出无音轨，本轮没有评估音乐同步。 |
| extension | [Chaos & Order：密集色块与圆阵列](http://127.0.0.1:8770/compare.html#r07-data-chaos-order) | 抽象几何动效，无数值叙事，不计入五条数据主选。 |
| extension | [Minimal Logo：字母碎片聚合](http://127.0.0.1:8770/compare.html#r07-brand-minimal-logo) | 模板类扩展；输出内容严重偏离，不以本次失败证明素材困难。 |
| control | [Adidas：简单 Logo 对照](http://127.0.0.1:8770/compare.html#r07-brand-adidas) | 低难度对照，不计入五条主选。 |
| excluded | [Strangers：歌词与人物混合](http://127.0.0.1:8770/compare.html#r07-lyric-strangers) | 完整片段末段混入真实人物抠图，不满足纯代码素材条件；前 11 秒文字观察保留，整段排除。 |
| excluded | [Saudi Fund：输出内容不符](http://127.0.0.1:8770/compare.html#r07-data-saudi-fund) | 输出与参考的语言、配色、图形结构均不符。排除有效实验，不依据泛化执行日志认定成功。 |
| excluded | [Interactive：错截为介绍文字](http://127.0.0.1:8770/compare.html#r07-data-interactive) | 截取的是介绍文字而非数据交互，选片错误。 |
| excluded | [SaaS UI：署名占主导](http://127.0.0.1:8770/compare.html#r07-product-saas-ui) | 大部分片段是作者署名，缺乏产品内容，选片错误。 |
| excluded | [Spring.new：重复派发记录](http://127.0.0.1:8770/compare.html#r07-software-spring-new) | 同目录曾被两个 agent 重复写入，首次尝试记录不可靠，排除正式统计。 |
| excluded | [SaaS UI Concept：重复派发记录](http://127.0.0.1:8770/compare.html#r07-software-saas-ui-concept) | 同目录曾被两个 agent 重复写入，首次尝试记录不可靠，排除正式统计。 |
| excluded | [Modern SaaS：实拍混入及重复派发](http://127.0.0.1:8770/compare.html#r07-software-modern-saas-demo) | 片段含酒店实拍，且同目录曾重复派发，排除。 |

## 这次记录不能支持的结论

- “渲染成功”只说明文件可播放，不表示还原准确。
- 四帧对照能发现明显差异，但可能漏掉短暂错误，不能代替连续播放和更密集检查。
- 本轮没有自动分数，没有用 LLM-as-judge 打分；这里是主 agent 的定性检查。
- 多数输出不含音轨，不能据此评价歌词与音乐的同步。
- 子 agent 被复用于多个任务，且具体模型版本与完整工具轨迹未统一固化；本轮属于探索，不能作为严格模型排名结果。
- 三条软件任务曾被重复派发，已排除。之后使用独占目录。
- 同一原片不同平台的链接不当成不同样本；Curriculum 的 YouTube 与 Vimeo 链接只保留一条。

## 如何查看与继续

1. 在项目目录运行 npm run compare，打开 http://127.0.0.1:8770/compare.html。默认显示本轮主选，可切换类别、扩展和排除记录。
2. 选视频后左右同步播放，可逐帧跳转；“原始来源”能回到作品页面。
3. 每条实验保存原片区间、首次源码与成片、技术日志、同帧图和观察记录。结构化总表为 data/round07-reviewed-results.json。
4. 对有价值的差异，用另一类别的新视频继续试；不要给复刻 agent 提示 seed，也不要用错误输出的修正版代替首次尝试。
5. 正式实验需要为每条启动独立 agent、固定模型与预算、保留完整轨迹，并统一素材输入；本轮不足之处不应沿用。
