# Dashboard：卡片组成仪表盘

来源：https://vimeo.com/1120414884

原片起点：9.6 秒；片段长度：5.5 秒。

5.5 秒界面构建片段；主要考验透视与多组件入场，操作因果较弱。

## 检查范围

主 agent 对照四个同时间点画面；只记录可见差异，不是自动打分，也不证明模型的内部失败原因。输出不包含音频评估。

## 可见差异

- 0.55 秒｜卡片与镜头位置：参考前三张卡片在画面中部且有明显远近差，复刻已将卡片放到上方并露出外框。 后续检查线索：透视镜头与卡片的位置共同变化（camera_content_binding）。

- 3.3 秒｜内部内容入场：参考外框已出现、内部菜单仍很暗，复刻菜单、数字和部分图形已经清楚可见。 后续检查线索：外框和内部组件分层进入（nested_reveal_timing）。

## 复现

在项目根目录运行（Composition ID 见本目录 entry.ts）：

```sh
npx remotion compositions experiments/r07-software-dashboard-build/entry.ts
npx remotion render experiments/r07-software-dashboard-build/entry.ts <Composition-ID> work/recheck-r07-software-dashboard-build.mp4 --codec h264 --concurrency 2
```

首次输出 recreation.mp4 保留，不用重渲染结果覆盖。实现自述在 replication-log.md，技术验证在 render-validation.json。