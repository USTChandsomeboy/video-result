# Horizon 独立复刻记录

只阅读了 public-input/instruction.md、objects.json、video-spec.json、asset-manifest.json、reference.mp4、提供的字体，以及 replica 空白工程和其已安装依赖。未读取原作源码、其他案例或隐藏检查。

观察方式：完整覆盖视频 0–20 秒的 5 fps 联系表，另外提取并查看每次主要材质切换的关键帧，以及开头、品牌出现和结尾帧。参考视频为 1920×1080、25 fps、500 帧，无音轨。

观察到的结构：
- 0–1.24 秒：深色地面上方蓝灰至橙色的日出弧线。
- 1.24–8.72 秒：金色珠边、赭色针点、棕皮纹、橙色、冰裂、蓝图、灰白大理石、叶脉、紫色褶皱、红色珠子、希腊回纹、缝线和奔跑兔子连续硬切。
- 8.72–10.68 秒：Wonder；背景依次为木纹、红石、迷幻纹理、黑白版画和大气层。
- 10.68–12.48 秒：lives at；背景切换红色虚化、暗色土壤、锈色地图、彩虹和黑白蕾丝。
- 12.48–15.96 秒：the edge；文字逐渐放大，背景切换纸层、蓝粉笔、金粉、白色褶皱、沙面、液体纹理、拼贴、薄荷细胞、熔岩、网格、涂鸦、纤维和陶色褶皱。
- 15.96–17.28 秒：Now in view 居中出现在深蓝天空上。
- 17.28–20 秒：Meridian 与半日标志；天空和日出地平线上移，品牌随后上移并消失。

实现：Remotion 控制 500 帧时间；两个真实 Canvas 分别绘制弧面和装饰，以 seeded noise、Voronoi 多边形、渐变、曲线和可编辑成员几何生成所有材质。兔子由独立椭圆、耳朵与腿部路径构成，腿随时间摆动。文字保持 SVG text，使用公开提供的 Newsreader；品牌半日为 SVG path 和 rect。全部 8 个公开对象 ID 绑定在实际可见 Canvas/SVG 根节点。没有把参考视频或其帧用于最终画面。

验证：TypeScript 编译通过；渲染前查看两张独立静帧。完整 output.mp4 只进行一次成功完整渲染并保留。依赖未安装或更改。渲染日志含共享环境自带的 media-parser 版本提示，未影响成功渲染。

交付元数据：H.264 / 1920×1080 / 25 fps / 500 帧 / 20.000 秒 / 29,477,323 字节。完整渲染成功退出码为 0，未重渲染。元数据使用 runtime/node_modules 中可运行的 ffprobe 校验（早先提供的旧 ffprobe 路径读取时无响应，已终止该次只读进程）。

渲染命令（在 replica 目录运行）：
```sh
PATH=[local artifact] REMOTION_BROWSER_EXECUTABLE=[local artifact] npm run render > render.log 2>&1
```

package.json 的 render 命令：`remotion render src/index.tsx Replica output.mp4 --codec=h264 --concurrency=2 --gl=angle`。
