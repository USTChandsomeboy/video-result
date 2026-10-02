# Video Result Viewer

这是一个用于查看视频参考片段与 Remotion 复刻结果的展示页面。当前仓库只放一个实际展示例子，但页面保留了多例切换能力；以后增加例子时，只需在 `examples.json` 中增加一条记录，并放入对应的视频和对照图。

## 使用

需要 Node.js 18 或更高版本。本项目只使用 Node.js 内置模块，不需要执行 `npm install` 或 `npm ci`：

```bash
npm run compare
```

然后打开：

```text
http://127.0.0.1:8770/compare.html
```

页面顶部保留下拉框。当前下拉框只有一个“示例”选项；选择其他记录后，页面会自动切换对应的参考视频、复刻视频、对照图和结果说明。

## 文件说明

- `compare.html`：支持多例切换的同步对比页面。
- `examples.json`：展示例子列表和差异数据。
- `examples/knowledge-network/`：当前唯一上传的展示例子。
- `serve.mjs`：本地静态文件服务。
