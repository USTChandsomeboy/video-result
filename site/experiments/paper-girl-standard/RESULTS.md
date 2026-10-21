# Paper Girl：复刻结果

自动源码评分 **37.5 / 100**。47 个对象、1193 / 1193 项检查得到完整分数。

| 项目 | 得分 | 权重 |
| --- | ---: | ---: |
| 元素存在 | 98.6 | 10% |
| 元素属性 | 47.5 | 15% |
| 相对关系 | 34.8 | 15% |
| 动效绑定 | 13.4 | 20% |
| 运动参数 | 19.6 | 25% |
| 进出与动作时序 | 51.4 | 15% |

主要差异：

1. **开头提前切镜。** 原作第 36 帧切入近景，复刻在第 30 帧切换，相差 0.25 秒。参考 `reference-source/src/Video.tsx` 的 SHOTS 与 `replica/src/Replica.tsx` 的 FrameScene。
2. **写字过程的相机与笔尖关系不准。** 原作在第 72–89 帧使用固定的缩放与平移，复刻在 2.84–3.00 秒渐变放大，并持续到 3.85 秒后才拉回；文字裁切、手臂位置和笔尖轨迹也不同。参考原作 `scenes/Notebook.tsx` 的 WritingScene、penTip 与复刻的 Notebook。
3. **飞机飞行的路径与队形不同。** 复刻三架飞机按自定起终点移动，曲线、间隔、尺寸和与太阳的相对位置有偏差。对应 flight.planes：关系 2.6、运动 17.3。
4. **人物与道具的配合不同。** 9.4 秒的原作中，太阳的双手遮在信纸前；复刻的手势、纸张和太阳的比例关系不同。折纸段的双手与折线位置也不同。

评分校验：标准解 100 分；自对照、实际标准解、六类错误源码和真实复刻四组记录齐全。48 项通用源码敏感性测试通过；SVG 实际长度与 pathLength=1 的等价绘制、冻结绘制进度和 SVG 文字换色测试通过。

分数评估已登记对象的二维图形、文字、空间关系及动作。纸张滤镜质感、音轨和精确字体像素不计入分数。集合内部没有逐个公开 ID 的成员按图形集合测量。

- 展示页：<https://ustchandsomeboy.github.io/video-result/experiments/paper-girl-standard/compare.html>
- 成片：`replica/output.mp4`
- 评分：`evaluation-v3/scores.json`
- 逐项证据：`evaluation-v3/checks.json`
- 画面对照：`evidence/reference-replica-contact.jpg`
