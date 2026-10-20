# Showreel 视频复刻记录

## 公开输入与规格

仅使用 `../public-input/instruction.md`、`video-spec.json`、`objects.json`、`asset-manifest.json`、`reference.mp4` 及其中提供的字体。参考视频为 1920×1080、60 fps、900 帧、15 秒，未包含音轨。工程依赖使用已准备的共享 node_modules，未安装新依赖。

## 观察与实现

通过全片 4 fps 和 10 fps 接触表逐段观察 0–15 秒的内容和动作，并抽取 14 张原始尺寸关键帧确认文字、版面和几何细节。观察图保存在 `observations/`，仅用于读取参考画面。

- 0–约 1.88 秒：黑底点阵、细圆环和红色中心点，十条长短交错的放射线展开并加粗；圆周排版旋转，主体收缩后通过圆形闪切转红底。以 SVG 圆、线和 textPath 实现。
- 约 1.88–3.57 秒：红底 NOVARA 逐字入场和轻微伸缩，细横线、章节小字、斜体 kinetic studio；字母逐个缩成圆点。文字均保留为文字节点。
- 约 3.27–5.64 秒：圆点转为六行，出现 One distance, six timings.、六种缓动标签、曲线小图和 A/B 轨道。六个点按 linear、sine in-out、expo out、back out、elastic、bounce 分别运动，带速度拉伸、残影、采样刻度，随后汇聚。
- 约 5.63–7.50 秒：蓝底中央形状从圆形变三角形、星形、方形，带旋转、红色轮廓残影；十二个小图形围绕主体公转并跟随变形，配圆周刻度、十字辅助线与参数文字。用采样多边形插值和逐帧旋转实现。
- 约 7.50–9.87 秒：方块展开为 153 个可编辑曲线瓷砖，形成连续的四分之一圆曲线图案；三次脉冲改变颜色和旋转。底部保留 TILES × 153、3 PULSES、SEED 07 文字。
- 约 9.53–11.25 秒：中心矩形窗口展开，576 点网格从平面转为球形再转为圆环，旋转并向镜头扩张。点、连线和运动短线由三维坐标插值及透视投影生成。
- 约 11.25–13.10 秒：快速切换 SNAP、IN.、高窄 SNAP、BACK.、STAY、满屏描边 STAY 和 FLUID.；切换红、黑、米白、蓝、荧光黄背景，保留提示文字、橙色句点和曲线坐标图。
- 约 13.10–15 秒：红底扩散光环、黑色放射标志、彩色粒子，标志缩小并左移，与 NOVARA / kinetic studio 组合；出现 REEL 2026、900 FRAMES、DRAWN IN TYPESCRIPT、OPEN FOR COMMISSIONS。
- 全片：四角裁切标记、品牌与年份、章节名称、帧时间码、60 FPS、128 BPM、四拍指示、BAR 1/8–8/8 和底部进度线。

实际绘制的对应 DOM/SVG 根节点均使用公开 `data-bench-object` ID。集合成员由代码分别生成，可独立编辑；未将参考视频或参考截图用于成片绘制。

## 校验与渲染

TypeScript：`PATH=[local artifact] npm run typecheck`，通过。

完整渲染命令：

```sh
PATH=[local artifact] REMOTION_BROWSER_EXECUTABLE=[local artifact] npm run render > render.log 2>&1
```

package.json render 脚本：

```sh
remotion render src/index.tsx Replica output.mp4 --codec=h264 --concurrency=2 --gl=angle
```

使用首次成功完整渲染作为交付。未生成或运行评分器、verifier，也未进行评分驱动修改。

实际结果：首次完整渲染成功（900/900 帧，进程退出码 0）。输出 `output.mp4` 为 H.264 High、1920×1080、60 fps、15.00 秒、900 帧、无音轨，9,896,946 字节。ffmpeg 全片解码通过（退出码 0），详情见 `output-metadata.log`。

SHA-256：`95f462560c9ebec44eab61afb4ce78918dfb6b31492af271c121b2903c972afe`。

渲染器提示共享依赖中 `@remotion/media-parser` 版本为 4.0.530，其余主要 Remotion 依赖为 4.0.535；该提示未阻止类型检查或渲染。无实际阻塞。
