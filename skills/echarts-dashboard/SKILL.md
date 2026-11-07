---
name: echarts-dashboard
description: 数据监控大屏的 ECharts 图表规范。用于编写或审查图表 option，约束坐标轴、阈值线、配色、空/错状态、大屏字号与反例。API 名称以 ECharts 官方文档为准。
license: MIT
---

# ECharts 图表规范（监控大屏）

## 0. 来源标记

- `[ECharts]`：ECharts 官方文档（Apache ECharts 5.x），https://echarts.apache.org/zh/option.html
- `[项目约定]`：无数值标准可引用，由使用方按场景确定，写明理由
- 数值阈值默认按 1920×1080、观看距离 3m 设定；窄屏另给下限

## 1. 每张图的最低要求（缺一即不合格）

1. 有单位：标题、副标题或轴名三选一，且单位与数值不分离 `[项目约定]`
2. 有时间范围：时间轴必须给出起止或"近 24 小时"这类窗口说明 `[项目约定]`
3. 有数据来源/更新时间：右上角或脚注 `[项目约定]`
4. 用 `echarts.init` 的真实图表，禁止手写 SVG / div 折线 `[项目约定]`
5. 空数据有明确呈现，不画一条贴底的假 0 线 `[项目约定]`

## 2. 全局配置

```js
{
  textStyle: { fontFamily: '"Noto Sans SC","Microsoft YaHei",sans-serif' },
  animationDuration: 300,
  animationEasing: 'cubicOut',
  color: PALETTE,           // 全站唯一色板，见 §5
  grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true }
}
```

- `grid.containLabel: true` 让轴标签计入边距，避免长单位被裁 `[ECharts grid.containLabel]`
- 容器变化用 `ResizeObserver` 调 `chart.resize()`，不要监听 `window.resize` 后整体 CSS `transform: scale` `[项目约定]`
- 同一屏所有图共用 `fontFamily`、字号档、色板；不允许每图自带一套 `[项目约定]`

## 3. 坐标轴

**刻度与网格线**

- 类目轴 `xAxis.axisTick.show: false`；数值轴 `yAxis.axisTick.show: false`，用网格线代替刻度 `[项目约定]`
- `yAxis.splitLine.show: true`，`lineStyle: { color: 'rgba(255,255,255,0.06)', width: 1 }`；横线数量 3–5 条，`splitNumber: 4` `[ECharts yAxis.splitNumber]`
- 类目轴 `xAxis.splitLine.show: false` `[项目约定]`
- 不要同时开 `axisLine`、`axisTick`、`splitLine` 三种深色线条，会形成"表格感" `[项目约定]`

**标签**

- 轴标签字号：1920 下 14px，窄屏最低 12px `[项目约定]`
- 时间轴 `axisLabel.hideOverlap: true`，格式固定 `HH:mm` 或 `MM-DD HH:mm`；不要出现斜排标签 `[ECharts axisLabel.hideOverlap]`
- 数值轴标签带单位时用 `formatter`，单位只出现一次；不要每个刻度都带单位 `[项目约定]`

**基线与范围**

- 柱状图 `yAxis.min: 0`，禁止截断纵轴 `[项目约定]`
- 折线图默认也从 0 起；确需放大波动时用 `scale: true`，并在副标题写明"纵轴截断" `[ECharts yAxis.scale]`
- 双 Y 轴最多两组，必须左右各自标单位并同色对应；没有单位不允许多轴 `[项目约定]`
- 时间轴 `boundaryGap: false`，首尾点贴边 `[项目约定]`

## 4. 数据表达

**阈值线**

```js
markLine: {
  silent: true,
  symbol: 'none',
  label: { formatter: '警戒 60', position: 'insideEndTop', fontSize: 12 },
  lineStyle: { type: 'dashed', width: 1, color: 'var(--warn)' },
  data: [{ yAxis: 60 }]
}
```
`[ECharts series-line.markLine]`
- 阈值线只放 1–2 条（警戒/严重）；超过 2 条改用 `markArea` 分区 `[项目约定]`
- 阈值线必须有文字，不能只靠虚线 `[项目约定]`

**最新值锚点**

- 用 `series.endLabel` 或 `markPoint` 标注最后一个点；不要另起一个 HTML 数字浮在图外 `[ECharts series-line.endLabel]`
- 锚点值必须与 tooltip、图例口径一致 `[项目约定]`

**面积填充**

- 只允许单系列使用 `areaStyle`，`opacity ≤ 0.15`，颜色与线同源 `[项目约定]`
- 多系列叠面积、彩虹渐变填充、低透明度多层叠加一律禁止 `[项目约定]`

**线型与平滑**

- 折线默认 `smooth: false`；只有累计量、平滑趋势才允许 `smooth: 0.2`，且副标题注明 `[项目约定]`
- 同图多系列必须同时用"色相 + 线型/标记"区分，不能只靠颜色 `[项目约定]`
- 数据量大（>2000 点）用 `sampling: 'lttb'` `[ECharts series-line.sampling]`

## 5. 配色

- 系列色 4–6 个，色相不同且**明度差 ≥ 8%**；同明度不同色相在投影/色弱下不可分 `[项目约定]`
- 中性色（轴、网格、次要文字）来自同一灰阶，不用纯黑 `#000` / 纯白 `#fff` `[项目约定]`
- 语义色固定：正常 `#3BA55D`，警戒 `#D9A441`，严重 `#D9534F`；语义色不参与系列配色 `[项目约定]`
- 图形与背景对比 ≥ 3:1，文字 ≥ 4.5:1 `[项目约定]`（与 `better-colors/contrast.md` 一致）
- 同屏系列 > 6 条：聚合为"其他"或拆成小多图，不允许继续加色 `[项目约定]`

## 6. 状态

| 状态 | 做法 |
|---|---|
| 加载中 | `chart.showLoading({ text: '加载中', color: accent, maskColor: 'rgba(0,0,0,0.25)', fontSize: 14 })` `[ECharts showLoading]` |
| 空数据 | `chart.clear()` 后用 `graphic` 居中写"暂无数据"；隐藏坐标轴与图例 `[ECharts graphic]` |
| 数据缺口 | `connectNulls: false`，缺口保留为断线；不得插值补齐 `[ECharts series-line.connectNulls]` |
| 数据异常 | 异常点用 `markPoint` 标红 + 文字说明；不要整条线变红 `[项目约定]` |
| 超范围 | 超出量程的点在轴端显示箭头 + "≥ 上限"标签；不得静默裁剪 `[项目约定]` |

## 7. 大屏适配

| 项目 | 1920×1080 | 窄屏（≤1366） |
|---|---|---|
| 轴标签 | 14px | 12px |
| 图例 | 14px | 12px，或改为直接标注 |
| 关键数值 | ≥32px | ≥24px |
| 线宽 | 1.5–2px | 1–1.5px |
| 数据点 | 4–6px | 3–4px |
| 网格线 | 1px / 6% 白 | 1px / 4% 白 |

`[项目约定]`
- 远距离可读：任何文字不小于 14px，细线不小于 1px `[项目约定]`
- 1920 与窄屏用同一 `option` 生成器，只切换字号/线宽/系列数，不维护两份配置 `[项目约定]`
- 图例优先直接标注在系列末端；图例块超过 4 项时改为顶部单行 `[项目约定]`

## 8. 反例清单（明确禁止）

1. 手写 SVG / Canvas / div 拼折线，绕过 ECharts `[项目约定]`
2. 无坐标轴、无单位、无时间范围 `[项目约定]`
3. 大面积低透明度填充叠成"糊成一片" `[项目约定]`
4. 颜色是唯一编码（色盲不可读、打印不可读） `[项目约定]`
5. `smooth: true` 掩盖报警突变 `[项目约定]`
6. 3D 柱、阴影、发光、彩虹渐变 `[项目约定]`
7. 每张图独立色板，同屏 8 种以上颜色 `[项目约定]`
8. 纵轴不从 0 起的柱状图 `[项目约定]`
9. tooltip 只有数字没有单位 `[项目约定]`
10. 空数据仍画 0 值线或"暂无数据"外还留着刻度 `[项目约定]`
11. 时间轴标签重叠、斜排 45° `[项目约定]`
12. 双 Y 轴不标单位 `[项目约定]`
13. 图例顺序与系列顺序不一致 `[项目约定]`
14. 用 `setOption` 每次都 `notMerge: true` 重建，导致动画闪烁 `[项目约定]`

## 9. 交付前检查（可执行）

- [ ] `grep` option：存在 `markLine` 时是否有 `label`；存在 `areaStyle` 时 `opacity ≤ 0.15`
- [ ] 柱图 `yAxis.min === 0`
- [ ] 时间轴有 `axisLabel.hideOverlap` 与固定 `formatter`
- [ ] 系列数 ≤ 6，颜色数 ≤ 6 + 3 语义色
- [ ] 有 `showLoading` 与空数据分支
- [ ] 有 `ResizeObserver` → `resize()`
- [ ] 无 `smooth: true`（或已注明理由）
- [ ] 每图有单位、时间范围、更新时间
- [ ] 截图检查：轴标签不裁切、图例不压线、网格线不超过 5 条

## 10. 来源清单

1. Apache ECharts. *配置项手册*. https://echarts.apache.org/zh/option.html （`grid.containLabel`、`xAxis.splitLine`、`yAxis.scale`、`yAxis.splitNumber`、`axisLabel.hideOverlap`、`series-line.markLine`、`series-line.endLabel`、`series-line.sampling`、`series-line.connectNulls`、`graphic`）
2. Apache ECharts. *API 手册*. https://echarts.apache.org/zh/api.html （`echartsInstance.showLoading`、`resize`）
3. 配色与对比度判据：本包 `better-colors/contrast.md`
