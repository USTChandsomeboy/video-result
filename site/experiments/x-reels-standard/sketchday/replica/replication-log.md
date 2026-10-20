# SketchDay 独立复刻日志

输入范围：仅阅读本案例 public-input/ 和 replica/，以及运行依赖。未读取 reference-source、原始导出、其他案例源码或隐藏评分。

观察：完整抽取 reference.mp4 的 0.5 秒间隔帧（0–78 秒），逐张观察全部七张接触表，并另查看 5、14、20、27、32、38、41、49、56、62、73、77 秒的原分辨率帧。原视频只有视频流，无音轨。

时间线与动作：
- 0–21.97 秒：米色纸张，弧形草地先描边再填色；右侧半太阳和两朵云；逐字写出 hello from the / doodle meadow；蓝鸟飞过；青蛙、猪、熊、羊、刺猬、长颈鹿、企鹅等逐个加入，附短促拟声文字；hello, sunshine! 入场，最后动物上跃。
- 21.97–31.97 秒：半球图案快速切换，依次为圆点、波纹、花瓣、叶子、条纹、鳞片、粉色脸部、圆形、棋盘和蜂巢等，字幕 so / many / places / to / explore；末端放大向日葵衔接花园。
- 31.97–44.1 秒：大向日葵拉远，左侧薰衣草、小红花、橙花和蓝花依次长出；右侧黄花、风铃花和果丛；蝴蝶与蜜蜂漂动；底部贴纸蔬果依次弹起，heave-ho / whoa 字幕；蓝色浪形过渡。
- 44.1–53.97 秒：海水背景斜光、上升泡泡、砂地和水草；蔬果升出；章鱼与六只彩色水母漂浮，鱼横穿和鱼群经过；章鱼从闭眼变为皱眉，再放松并出现爱心；浅色淡出。
- 53.97–58.07 秒：桃色日落拼贴，彩色水面、下沉太阳、云、船和远山，绿粉两鸟站在枝条上；横向移动，逐字出现 then the sky got sleepy...；夜色波形覆盖。
- 58.07–65.5 秒：深蓝夜村、左侧大树、五栋彩色房屋、月亮；窗户依次点亮，星星闪动，底部萤火虫漂移；sleep tight；彩色放射圆形扩张。
- 65.5–76.37 秒：彩色放射线，角色沿椭圆圈依次进入，中间青蛙摆手；inked with care, / set free to play. 两行逐字出现，最终圆形收缩。
- 76.37–78.067 秒：深色纸张收尾，see you soon 与粉色爱心，最后淡出。

实现：所有角色由独立可编辑 SVG 路径、圆、椭圆绘制，字体使用提供的 Caveat Brush 和 Patrick Hand。仅使用提供的 paper.png 作整幅 multiply 纸张纹理。SVG 形态与动画由时间函数生成，贴纸白边使用 SVG morphology。公开对象 ID 绑定实际可见 SVG g 或角色根节点，同一帧每个 ID 唯一。素材未替换为参考帧或视频。

交付与验证：src/Replica.tsx、src/Characters.tsx 为完整源码。Composition ID=Replica。类型检查通过后执行整段首次渲染，concurrency=2。完整命令及结果记录于 render.log；输出参数在渲染完成后通过 ffprobe 检查。


实际交付目录：`[local artifact] 路径 iCloud 文件读取出现 ETIMEDOUT，首次启动未完成、没有完整输出；将自己的相同复刻源码和公开素材恢复到 Code 稳定目录后，类型检查 exit 0，第一次完整渲染成功 exit 0。未进行视觉返修或第二次成功渲染。所有 17 个公开对象 ID 均在实际 SVG 场景根节点绑定。

渲染命令：`PATH=[local artifact] REMOTION_BROWSER_EXECUTABLE=[local artifact] node node_modules/@remotion/cli/remotion-cli.js render src/index.tsx Replica output.mp4 --codec=h264 --concurrency=2 --gl=angle --crf=18 --log=info`

ffprobe 验证：1920×1080、H.264、30/1 fps、2342 帧、78.066667 秒，无音轨。详情见 output-metadata.json。

全片解码自检：稳定 FFmpeg -v error -i output.mp4 -c:v rawvideo -f null -，exit 0。常规 null 默认编码器未在此精简 FFmpeg 内启用，故显式指定 rawvideo；无视频解码错误。源码及输出 SHA-256 登记于 source-hashes.json，解码日志为 decode-check.log。
