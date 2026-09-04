# Lexi Liang — Portfolio

Lexi Liang 的双语交互设计作品集。网站用于呈现个人背景、Selected Work、项目详情与联系方式，重点关注 AI 产品、智能硬件和未来交互。

本仓库负责网站代码、UI、内容映射、生成内容和发布历史。项目原文与源素材由独立的 Private Obsidian 仓库管理。

完整的仓库、worktree、分支、Archive、内容同步与发布规则见 [`docs/HANDOFF.md`](docs/HANDOFF.md)。涉及结构调整或发布前，请以该文档为准。

## 仓库职责

```text
lexiiiliang/obsidian（Private）
└── 项目原始文案与源素材

lexiiiliang/Portfolio
├── 网站代码与交互
├── 项目展示配置
├── 生成内容与媒体
└── 测试、预览和发布历史
```

Obsidian 是项目内容的事实来源；Portfolio 只读取和转换内容，不应静默改写、移动或删除 Obsidian 原文。

## 两个长期工作台

仓库固定保留两个长期 worktree：

| 工作台 | 默认分支 | 用途 | 本地地址 |
|---|---|---|---|
| `/Users/lianglezhi/Documents/GitHub/Portfolio` | `preview` | 主线开发与完整站点集成 | [localhost:3000](http://localhost:3000/) |
| `/Users/lianglezhi/Documents/GitHub/Portfolio-lab` | `experiment/<idea>` | 新想法的隔离实验 | [localhost:3001](http://localhost:3001/) |

主线工作台通常停在 `preview`，只在正式发布检查时切到 `main`。实验工作台通常停在当前实验分支，需要检查旧过程稿时可以临时切换到 Archive。

除非用户明确要求，不创建新的长期 Portfolio worktree。删除 worktree 前必须取得用户同意。

## 分支结构

```text
main
└── 最终上线版本

preview
└── 当前开发与集成版本

experiment/<idea>
└── 当前正在隔离调试的想法

archive/<name>
└── 用户明确要求保存的重要过程稿
```

当前主要分支：

```text
main
preview
experiment/selected-work-tldr
archive/cursor-tracker
archive/paper-drawer-v1
```

规则：

- 日常开发不直接提交到 `main`。
- 新想法从最新 `preview` 创建 `experiment/<idea>`。
- 实验只有在用户明确确认后才进入 `preview`。
- `preview` 只有在用户明确确认发布后才进入 `main`。
- 生产部署必须再次获得明确授权，合并不等于部署。
- Archive 只有在用户明确说“存档”时创建，也不能参与常规清理。

## 开发管线

```text
新 Idea
→ Portfolio-lab / experiment/<idea>
→ localhost:3001 隔离验证
→ 用户确认满意
→ 合入 preview
→ localhost:3000 全站验证
→ 冻结正式内容
→ 用户确认发布
→ 合入 main
→ 用户明确要求后部署生产环境
```

## 内容系统

内容源：

- Repository：`https://github.com/lexiiiliang/obsidian.git`
- Visibility：Private
- Default branch：`main`
- Portfolio root：`02_Portfolio`

网站内容映射与输出：

| 文件或目录 | 作用 |
|---|---|
| `portfolio.config.json` | 项目顺序、slug、标题、摘要、语言入口、发布状态和保护状态 |
| `content/portfolio.generated.json` | 当前版本化发布内容 |
| `public/media/projects/` | 从 Obsidian 引用并同步到网站的媒体 |
| `docs/网站内容管理.md` | 内容格式与发布约定 |

同步过程会读取项目 Markdown、选取公开区间、生成标题导航、过滤编辑 TODO，并复制被引用的媒体。项目正文不得由网站开发过程擅自补写或改写。

## 当前内容同步行为

当前代码仍通过 `PORTFOLIO_CONTENT_ROOT` 读取本地 Obsidian working copy：

```text
npm run content:sync
```

`npm run dev` 和 `npm run build` 目前都会执行该同步。如果当前设备没有配置可用的本地内容源，则继续使用仓库中已有的 `content/portfolio.generated.json`。

本地设备路径通过未提交的 `.env.local` 配置，不应写死在 README、公共配置或版本历史中。

## 目标内容同步行为

远端监听方案已经确定，但尚未实现：

```text
Private obsidian repository
→ 检查远端 branch commit SHA
→ SHA 变化时执行 shallow + sparse fetch
→ 覆盖一份 ignored Preview 缓存
→ 重新生成临时内容
→ localhost 热更新
```

目标默认值：

| 工作台 | Obsidian 内容分支 | 缓存 | 用途 |
|---|---|---|---|
| `localhost:3000` | `obsidian/main` | 单份可覆盖缓存 | 当前正式内容的 Preview |
| `localhost:3001` | 对应的 `obsidian/experiment/<idea>` | 单份可覆盖缓存 | 未确定内容和 UI 实验 |

Preview 不创建按时间命名的多个快照。每个工作台只保留一份最新缓存；离线时使用最后有效缓存，没有缓存时回退到冻结内容。

计划中的正式冻结命令：

```text
npm run content:freeze
```

该命令尚未实现。完成后，它将把确切的 Obsidian commit、内容校验值、生成正文和使用到的媒体冻结为唯一当前发布快照。正式生产构建只读取冻结快照，不访问 Private Obsidian 仓库。

## 内容修改分流

小型、确定的内容更新：

```text
obsidian/main
→ Portfolio preview
→ localhost:3000
→ 定稿时冻结
```

大型或方向未定的内容实验：

```text
obsidian/experiment/<idea>
→ Portfolio-lab/experiment/<idea>
→ localhost:3001
→ 用户确认后分别合回 obsidian/main 和 Portfolio/preview
```

同一个项目子页面不需要拆成独立仓库。一次明确的修改目标对应一条实验分支，分支只记录实际发生变化的文件。

## 本地运行

要求：Node.js `>=22.13.0`。

安装依赖：

```bash
npm install
```

启动主线工作台：

```bash
cd /Users/lianglezhi/Documents/GitHub/Portfolio
npm run dev -- --host 0.0.0.0 --port 3000
```

启动实验工作台：

```bash
cd /Users/lianglezhi/Documents/GitHub/Portfolio-lab
npm run dev -- --host 0.0.0.0 --port 3001
```

其他命令：

```bash
npm run content:sync
npm run lint
npm run build
npm run build:vercel
npm test
```

- `npm run build`：Cloudflare/Vinext 构建。
- `npm run build:vercel`：Vercel 使用的原生 Next.js 构建。
- `npm test`：构建并运行渲染内容测试。

## 环境配置

复制 `.env.example` 为不提交的 `.env.local`，配置当前设备需要的私密或本地变量。

常见变量：

```text
PORTFOLIO_PASSWORD=<server-side password>
PORTFOLIO_CONTENT_ROOT=<optional local Obsidian content root>
```

规则：

- 不提交 `.env.local`。
- 不把 GitHub Token 写进代码、配置或浏览器环境变量。
- Private Obsidian 的远端访问复用本机 GitHub CLI、SSH 或系统凭证。
- Vercel 正式构建不应获得整个 Obsidian 仓库的访问权限。

## Archive

Archive 是 Git 分支命名空间，不是常驻 worktree：

```text
archive/cursor-tracker
archive/paper-drawer-v1
```

- `archive/cursor-tracker`：独立的 “Move around. She follows.” Cursor Tracker 站点。
- `archive/paper-drawer-v1`：Selected Work 的固定高度 Paper Drawer TL;DR 版本。

完整目录和提交信息见 [`archive/README.md`](archive/README.md)。

归档必须保留可运行状态、关键素材、交互说明和不可变 Git tag。未经用户明确同意，不删除 Archive 分支、标签或相关 worktree。

## 检查与预览

每次完成网站修改后：

1. 运行与改动风险相称的检查。
2. 启动或刷新对应 localhost。
3. 在交付说明中提供可点击的预览地址。
4. 说明所在分支、提交状态和是否推送。
5. 说明内容来自远端 ref、临时缓存还是冻结快照。

小型或常规修改只使用 localhost。除非用户明确要求，不自动创建 Vercel Preview，也不进行生产部署。

## 文档

- [`docs/HANDOFF.md`](docs/HANDOFF.md)：完整仓库操作手册和 Handoff。
- [`docs/网站内容管理.md`](docs/网站内容管理.md)：Obsidian 内容格式与发布约定。
- [`archive/README.md`](archive/README.md)：过程存档索引。
- [`PRODUCT.md`](PRODUCT.md)：产品定位、内容边界与设计原则。
- [`AGENTS.md`](AGENTS.md)：协作者必须遵守的高优先级执行规则。
