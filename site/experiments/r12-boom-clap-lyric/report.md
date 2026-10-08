# R12：Boom Clap 动效排版歌词 MV

## 选片理由

输入 seed 是 `text_background_sync` 和 `text_identity_continuity`，类别是歌词 MV / 动效排版。这个片段以文字、字形、彩色图形和重复背景为主，主要画面可以用 SVG、文字和路径表达，适合 Remotion 验证。

来源：[Boom Clap Kinetic Typography MV](https://www.youtube.com/watch?v=DVnOD8TsAwQ)。本地片段是原片前 15 秒，24fps、1280×720、360 帧。

## 当前复刻暴露的问题

- 标题的大小、堆叠和反射关系没有保持。
- 文字构图切到彩色图形时，旧文字没有按参考的边界退出。
- 参考从重复小对象收束到单个大图形，复刻保留了过多旧对象。
- 近景和运动模糊被简化成静态组合，文字和背景没有共享同一转场。

这条片段适合继续验证文字布局状态、文字对象身份和文字与背景共同转场。
