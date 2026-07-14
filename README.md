# Todo List · 全能待办

一个视觉炫酷、功能完整的待办事项单页应用。采用 2025 年最现代的前端技术栈与标准工程化仓库结构构建，纯前端、本地持久化、零后端依赖。

> **在线体验**：<https://godddddy.github.io/todo-list/>

## ✨ 功能

- **任务增删改查**：添加、编辑、删除、标记完成
- **多清单管理**：新建、切换、删除清单（工作 / 生活 / 学习）
- **任务属性**：优先级（高 / 中 / 低）、多标签、截止日期（逾期标红）
- **置顶与拖拽排序**：`@dnd-kit` 无障碍、触摸友好的拖拽排序
- **子任务**：单任务下挂载可勾选子任务，带完成进度
- **筛选与搜索**：状态 / 优先级 / 标签筛选 + 关键字搜索
- **批量操作**：全选完成、清空已完成
- **统计可视化**：完成进度环、连续打卡 streak、近 7 日完成数柱状图（recharts）
- **主题与外观**：亮 / 暗 / 跟随系统、自定义强调色取色器
- **完成撒花**：全部完成时 canvas-confetti 庆祝
- **多语言**：中文 / 英文实时切换
- **数据导入导出**：JSON 导出 / 导入
- **番茄钟**：25 分钟专注计时器
- **语音输入**：Web Speech API 听写添加任务
- **每日模板**：一键添加预设示例任务
- **持久化**：localStorage 自动保存

## 🧱 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript 5.7 |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3.4 + CSS 变量 |
| 组件 | shadcn/ui 风格（Radix UI 基元 + CVA） |
| 状态 | Zustand（persist → localStorage） |
| 动画 | Framer Motion |
| 拖拽 | @dnd-kit |
| 图表 | recharts |
| 图标 | lucide-react |
| 撒花 | canvas-confetti |
| 日期 | date-fns |
| 规范 | Biome（lint + format 一体） |
| Hooks | Husky + lint-staged |

## 📁 目录结构

```
todo-list/
├─ index.html                  # 入口 HTML
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx                 # 应用入口
│  ├─ App.tsx                  # 根组件，串联功能
│  ├─ index.css                # Tailwind 指令 + 主题变量
│  ├─ types/                   # 类型定义
│  ├─ lib/                     # 工具：utils/constants/i18n/color/date/id
│  ├─ store/                   # Zustand：todo / ui / toast
│  ├─ services/                # 导出导入、主题应用
│  ├─ hooks/                   # usePomodoro / useVoiceInput / useShortcut
│  └─ components/
│     ├─ ui/                   # shadcn 基础组件
│     ├─ layout/               # Sidebar / Topbar
│     ├─ todo/                 # Toolbar / FilterBar / TagsBar / TaskList / TaskItem / TaskModal / EmptyState
│     ├─ stats/                # ProgressRing / WeeklyChart / StatsPanel
│     ├─ modals/               # PomodoroModal / SettingsModal
│     └─ effects/              # ThemeSync / Toaster / Confetti
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.ts
├─ tsconfig*.json
├─ biome.json
└─ package.json
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview

# 代码检查与格式化
npm run check
```

## ⌨️ 快捷键

| 键 | 功能 |
| --- | --- |
| `/` | 聚焦输入框 |
| `P` | 打开番茄钟 |
| `S` | 打开设置 |
| `T` | 添加每日模板 |

## 🚀 部署

### GitHub Pages（已配置）

推送 `main` 分支即自动触发 GitHub Actions 构建并部署到 GitHub Pages。

首次使用需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

访问地址：<https://godddddy.github.io/todo-list/>

### 其他平台

详见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)，支持 Vercel / Netlify / EdgeOne Pages / Cloud Studio 等。

## 📄 License

MIT
