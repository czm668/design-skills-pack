# Design Skills Pack

一组面向 Web 界面与监控大屏的设计技能（Agent Skills）。每个技能是一个独立目录，入口为 `SKILL.md`，可直接放入 Claude Code、Trae 等支持 Agent Skills 的工具中使用。

目标不是"多"，而是把设计判断变成**可执行判据**：字号、间距、对比度、动效曲线、图表配置、审查清单都有具体数值或禁止项。

## 包含什么

| 技能 | 解决什么问题 | 类型 | 许可 |
|---|---|---|---|
| `impeccable` | 设计总监级工作流：表面模式、工艺底线、排版、布局、批判打分 | 第三方 | Apache-2.0 |
| `make-interfaces-feel-better` | 组件级工艺 19 条：同心圆角、光学对齐、阴影、图标、微交互 | 第三方 | MIT |
| `better-typography` | 字阶、字重、可变字体、断行、标点、数字对齐 | 第三方 | MIT |
| `better-colors` | 明度阶梯、语义令牌、对比度实测、调色板生成 | 第三方 | MIT |
| `better-layout` | 分组、对齐、阅读顺序、响应式与复排 | 第三方 | MIT |
| `better-accessibility` | 键盘焦点、ARIA、表单、播报、缩放，对齐 WCAG 2.2 | 第三方 | MIT |
| `emil-design-eng` | 动效决策：曲线、时长、属性选择、Before/After 评审 | 第三方 | MIT |
| `web-design-reviewer` | 截图 + DOM 检查 → 定位 → 修复 → 复检的视觉审查闭环 | 第三方 | MIT |
| `chinese-typography` | 中英混排、标点、断行、中文字号与字重、数字对齐 | 自建 | MIT |
| `echarts-dashboard` | ECharts 坐标轴、阈值线、配色、空/错状态、大屏适配、反例 | 自建 | MIT |
| `visual-regression` | 无头浏览器截图 + pixelmatch 像素比对，输出差异图与差异百分比 | 自建 | MIT |

第三方技能的完整署名与许可证见 [THIRD_PARTY.md](THIRD_PARTY.md)。

## 怎么用

**1. 安装到技能目录（整目录复制，不要只复制 SKILL.md）**

- Claude Code：`~/.claude/skills/<skill-name>/`
- Trae（Windows）：`%USERPROFILE%\.trae-cn\skills\<skill-name>\`

**2. 按顺序使用**

- 设计前：`better-layout` → `better-typography` → `better-colors` → `emil-design-eng` → `impeccable`（`reference/craft-floor.md`）
- 交付前：`web-design-reviewer` → `better-accessibility` → `make-interfaces-feel-better` 19 条自检 → `impeccable`（`reference/critique.md`）打分
- 中文界面与图表：`chinese-typography`、`echarts-dashboard`
- 改版前后对比：`visual-regression`

**3. 视觉回归工具**

```bash
cd skills/visual-regression
npm install
node scripts/run.js --url demo/index.html --name demo --width 960 --height 540
node scripts/run.js --url demo/index-changed.html --name demo --width 960 --height 540
```

依赖：`pixelmatch`（ISC）、`pngjs`（MIT）。截图调用系统已安装的 Chrome / Edge，不使用 Playwright；Windows 下自动查找，macOS / Linux 若未装到常见位置，用 `BROWSER_PATH=/path/to/browser` 指定。

## 许可

- **第三方技能**：保留各自上游 LICENSE 原文与版权声明；`impeccable` 额外保留 `NOTICE.md`。这些内容**不**适用本仓库顶层的 MIT 许可。
- **自建技能**（`chinese-typography`、`echarts-dashboard`、`visual-regression`）：**MIT**。目录内各有一份 `LICENSE`，与顶层许可一致，文档与脚本不分拆协议，避免"哪段适用哪个许可"的歧义。
- **顶层 `LICENSE`**：MIT，覆盖根目录文档与自建技能；文末有明确的适用范围声明。

## 不包含什么

- 任何项目私有信息：业务代码、内部路径、密钥、项目文档、数据分析脚本
- 任何本机绝对路径：脚本通过环境变量或常见安装位置自动探测浏览器
- 任何二进制、下载器、`scripts/` 启动器
- 无 LICENSE 的上游项目（见 THIRD_PARTY.md 的排除表）

## 发布状态

- 仓库：https://github.com/czm668/design-skills-pack（public，默认分支 `main`）
- 自建技能许可 MIT，第三方技能保留各自上游许可（见 [THIRD_PARTY.md](THIRD_PARTY.md)）
- 获取：`git clone https://github.com/czm668/design-skills-pack.git`，或直接下载 ZIP；按上文"怎么用"把需要的技能目录复制进自己的 skills 目录

## 维护与反馈

- 维护者：[@czm668](https://github.com/czm668)
- 问题与建议：https://github.com/czm668/design-skills-pack/issues
- 第三方技能的问题请优先反馈给上游项目（上游地址见 [THIRD_PARTY.md](THIRD_PARTY.md)）

## 目录结构

```
design-skills-pack/
├── README.md
├── LICENSE
├── THIRD_PARTY.md
├── .gitignore
└── skills/
    ├── impeccable/
    ├── make-interfaces-feel-better/
    ├── better-typography/
    ├── better-colors/
    ├── better-layout/
    ├── better-accessibility/
    ├── emil-design-eng/
    ├── web-design-reviewer/
    ├── chinese-typography/
    ├── echarts-dashboard/
    └── visual-regression/
```
