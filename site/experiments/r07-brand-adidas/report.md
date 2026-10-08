# Adidas：简单 Logo 对照

来源：https://vimeo.com/1101315109

原片起点：0 秒；片段长度：5.0 秒。

低难度对照，不计入五条主选。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

尚未完成主 agent 画面对照，不能只凭渲染成功认定复刻完成。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-brand-adidas/entry.ts
npx remotion render experiments/r07-brand-adidas/entry.ts <Composition-ID> work/recheck-r07-brand-adidas.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。