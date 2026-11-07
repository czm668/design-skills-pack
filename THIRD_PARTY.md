# 第三方许可证与署名

本仓库包含两类内容：自建技能（MIT，见顶层 `LICENSE`）与第三方技能（各自上游许可）。
下表逐项列出上游地址、作者、许可证，以及本地保留的许可证文件位置。

| 技能目录 | 上游仓库 | 作者 / 版权 | 许可证 | 本地许可证文件 |
|---|---|---|---|---|
| `impeccable` | https://github.com/pbakaus/impeccable | Paul Bakaus（pbakaus） | Apache-2.0 | `skills/impeccable/LICENSE`、`skills/impeccable/NOTICE.md` |
| `make-interfaces-feel-better` | https://github.com/jakubkrehel/make-interfaces-feel-better | Copyright (c) 2026 Jakub Krehel | MIT | `skills/make-interfaces-feel-better/LICENSE` |
| `better-typography` | https://github.com/jakubkrehel/skills | Copyright (c) 2026 Jakub Krehel | MIT | `skills/better-typography/LICENSE` |
| `better-colors` | https://github.com/jakubkrehel/skills | Copyright (c) 2026 Jakub Krehel | MIT | `skills/better-colors/LICENSE` |
| `better-layout` | https://github.com/jakubkrehel/skills | Copyright (c) 2026 Jakub Krehel | MIT | `skills/better-layout/LICENSE` |
| `better-accessibility` | https://github.com/jakubkrehel/skills | Copyright (c) 2026 Jakub Krehel | MIT | `skills/better-accessibility/LICENSE` |
| `emil-design-eng` | https://github.com/emilkowalski/skills | Copyright (c) 2026 Emil Kowalski | MIT | `skills/emil-design-eng/LICENSE` |
| `web-design-reviewer` | https://github.com/github/awesome-copilot | Copyright GitHub, Inc. | MIT | `skills/web-design-reviewer/LICENSE` |

## Apache-2.0 说明

`impeccable` 采用 Apache-2.0。目录内保留完整 `LICENSE` 与 `NOTICE.md`；`NOTICE.md` 记录了其上游再引用内容（如平台设计规范的改写来源）。分发时不要删除这两个文件。

`impeccable` 的 `scripts/` 启动器未包含在本仓库：该启动器首次运行会下载并执行一个自包含二进制。本包只分发其文档与参考文件。

## 字体与图片

本仓库不包含任何字体文件、图片或截图。演示页只使用系统字体栈。

## 未纳入本仓库的上游项目（原因）

| 项目 | 原因 |
|---|---|
| `vercel-labs/agent-skills`（web-design-guidelines） | 仓库无 LICENSE 文件，无法确认再分发授权 |
| `mikeandrusyak/dataviz-skill` | 仓库无 LICENSE 文件 |
| `Leonxlnx/taste-skill` | 营销站专用规则，与本包面向"监控界面"的定位冲突；工作流依赖额外运行时 |
| `nextlevelbuilder/ui-ux-pro-max-skill` | 核心检索依赖 Python 运行时，纯文档部分不构成可执行判据 |
| `ComeOnOliver/skillshub`（echarts） | `SKILL.md` 无 YAML frontmatter，不符合 Agent Skill 约定 |
| 各类名为 Galaxy 的 UI 库 | 无明确 LICENSE 或非 Vue 生态，且不属于技能形态 |
| `antvis/chart-visualization-skills` | 由本地技能市场管理，不在本包分发范围；如需可另行安装 |
| `anthropics/skills` 的 `frontend-design` | 由本地技能市场管理，不在本包分发范围 |

## 引用但未打包的资料

`skills/chinese-typography` 与 `skills/echarts-dashboard` 引用外部规范条文（W3C clreq、中文文案排版指北、ECharts 官方文档、MDN）作为判据来源，仅做转述与链接，未复制其正文，因此不构成再分发。
