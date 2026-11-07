---
name: visual-regression
description: 截图与像素比对工具。用已安装的 Chromium 无头模式截图，pixelmatch 计算差异像素与百分比，输出差异图。用于检查改版前后界面是否只改了预期的地方。不依赖 Playwright。
license: MIT
---

# 视觉回归（截图 + 像素比对）

## 依赖

| 包 | 版本 | License | 用途 |
|---|---|---|---|
| `pixelmatch` | ^7.1.0 | ISC | 像素比对 |
| `pngjs` | ^7.0.0 | MIT | PNG 读写 |

截图不安装浏览器依赖，直接调用系统已有的 Chrome / Edge（`--headless=new`）。

## 安装

```bash
cd skills/visual-regression
npm install
```

## 用法

**1. 一次完整比对（首次会建立基线）**

```bash
node scripts/run.js --url demo/index.html --name demo --width 960 --height 540
# 首次：生成 artifacts/demo/baseline.png
# 之后：生成 current.png + diff.png，并输出差异百分比
```

**2. 更新基线（确认改动是预期的）**

```bash
node scripts/run.js --url demo/index.html --name demo --update
```

**3. 只比对两张已有截图**

```bash
node scripts/compare.js before.png after.png --out diff.png --threshold 0.1
```

输出 JSON，含 `diffPixels`、`totalPixels`、`diffPercent`、`diffImage`、`status`。退出码：`0` 未超阈值，`1` 超阈值或尺寸不一致，`2` 参数/环境错误。

## 演示（本包已验证）

```bash
node scripts/run.js --url demo/index.html --name demo --width 960 --height 540
node scripts/run.js --url demo/index-changed.html --name demo --width 960 --height 540
```

`demo/index-changed.html` 只把进度条颜色从 `#4C8DFF` 改成 `#E0A33E`。实测结果：

```json
{ "diffPixels": 1412, "totalPixels": 518400, "diffPercent": 0.2724, "status": "fail" }
```

即单处改色可被检出，差异图输出到 `artifacts/demo/diff.png`。

## 边界（必读）

- **尺寸必须一致**：1920×1080 对 1366×768 会直接报 `size-mismatch`，不做缩放对齐。
- **不消除环境差异**：不同机器字体渲染、显卡抗锯齿、滚动条会带来噪声；同一台机器、同一浏览器版本下比较才可靠。
- **不是像素级回归的全部**：文字重排、跨平台字体差异不在本工具职责内；它只回答"这两张图差在哪、差多少"。
- **不做 CI 集成**：本项目只本地手动跑；不写 GitHub Actions。
- **截图时机**：`--wait` 默认 3000ms（`--virtual-time-budget`）；异步图表需加大到 5000–8000。
- 动态内容（时间、随机数、动画）会产生误报，截图前应固定时钟或关闭动画。

## 目录约定

```
artifacts/<name>/
  baseline.png
  current.png
  diff.png
```

`artifacts/` 与 `node_modules/` 已在包级 `.gitignore` 中排除，不进入发布仓库。
