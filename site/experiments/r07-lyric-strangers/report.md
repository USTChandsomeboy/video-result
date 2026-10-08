# Strangers：歌词与人物混合

来源：https://vimeo.com/1225337923

原片起点：32.0 秒；片段长度：15.0 秒。

完整片段末段混入真实人物抠图，不满足纯代码素材条件；前 11 秒文字观察保留，整段排除。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 5.25 秒｜放大区域与文字位置：参考放大镜罩住当前单行文字，复刻放大镜偏到左下并显示另一行词。 后续检查线索：移动遮罩与被放大内容保持同一位置（object_binding）。

- 12.75 秒｜素材条件未满足：所选片段末段包含真实人物抠图，复刻用手绘人物代替。 后续检查线索：整段不满足纯代码素材标准，不能以人物差异提炼 seed；仅前11秒可研究文字（invalid_selection）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-lyric-strangers/entry.ts
npx remotion render experiments/r07-lyric-strangers/entry.ts <Composition-ID> work/recheck-r07-lyric-strangers.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。