# 羽毛与铁球：视频复刻与评分

[打开同步对比页](https://ustchandsomeboy.github.io/video-result/experiments/feather-vs-ball-harbor/index.html)。完整 96 秒、1920×1080、30 fps。

复刻得分 **63.63 / 100**，25 个对象、305 项检查均有结果。标准解完成完整渲染并获得 100 分，本机 Harbor 验收通过。

主要差异：羽毛下落与摆动曲线、公式约去质量时的上移和排版收拢、抽气时分子的运动过程。绳子端点持续连接关系在源码复核中发现，当前未计分。

首次独立 agent 在完整视频交付前超时，随后使用同一冻结源码和同一镜像补完渲染，复刻源码没有修改。音频听感、字体像素相似度和未列出的装饰细节未计分。

index.html 展示同步播放、六维分数、25 个对象及逐项源码证据；code-review.html 给出关键代码差异。完整逐项数据以 checks.json.gz 提供，解压后为 JSON。公开证据中的本机绝对路径已处理，分数及源码指纹保留。

视频登记在站点根目录 feather-vs-ball-media.json，存放于 GitHub Release，部署时校验 SHA-256 并恢复为同域媒体。Harbor 任务本身仍是本机实验包，其完整素材分发地址尚未发布。
