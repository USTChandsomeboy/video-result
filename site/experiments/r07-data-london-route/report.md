# 伦敦到摩洛哥：路线与里程

来源：https://vimeo.com/1092713718

原片起点：10.0 秒；片段长度：15.0 秒。

条件样本：地图底图和地形素材未统一，不能把纹理差异视为动效 weakness。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 9 秒｜路线和数值进度：参考路线已延伸到非斯附近，复刻仍在北部；里程表显示的数字也不同。 后续检查线索：路线终点和数字计数由同一进度驱动（geometry_label_binding）。

- 12.75 秒｜地图素材差异：复刻采用另一份公开地理轮廓并程序生成地形；原片的山地纹理、地名和边界密度均不同。 后续检查线索：素材条件未统一，纹理差异不能当作模型动效 weakness（asset_mismatch）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-data-london-route/entry.ts
npx remotion render experiments/r07-data-london-route/entry.ts <Composition-ID> work/recheck-r07-data-london-route.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。