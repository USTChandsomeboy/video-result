# 歌词 MV：素材合成 GT 与 SVG 独立重绘

[打开对比页](https://ustchandsomeboy.github.io/video-result/experiments/lyric-mv-verifier/index.html)。

本例总分 **50.3 / 100**，覆盖 110 个图层对象、25 段场景和 658 项检查。页面支持同步播放、逐帧查看、对象定位、六维分数及逐项证据下载。

左侧是第一版素材合成成片的展示版，已去除抖音标识、账号文字、开场导演和监制署名，末尾推广卡片替换为纯色收尾。右侧是 SVG 独立重绘成片。音频和时长保留。展示清理不改变以原始源码和素材为依据的评分。

六项权重依次为：元素存在 10%、元素属性 15%、相对关系 15%、动效绑定 20%、运动参数 25%、进出时序 15%。GT 的内部人物姿态保存在图片中，本例评估图层可见属性与变化过程。字幕覆盖范围、位置和出现时间，歌词逐字内容尚未核验。具体范围见 REPORT.md。

results/scored/ 保存分数及源码证据；object-manifest.json 保存对象对应；results/calibration-summary.json 保存自对照、等价改写和定向错误校准结果。

媒体登记在站点根目录 lyric-mv-verifier-media.json，视频存放于 GitHub Release，部署时按 SHA-256 校验并恢复为站点同域文件。
