# Deployment Guide

本项目支持多种部署方式，以下介绍 Cloud Studio 部署与通用静态托管部署。

## Cloud Studio 部署

项目根目录的 `.cloudstudio` 文件是 Cloud Studio 的部署配置：

```toml
[[app]]
name = "Todo List - 全能待办单页应用 (React 19 + Vite + TypeScript + Tailwind)"
port = 5_173
cmd = "npm run dev -- --host 0.0.0.0"
```

### 步骤

1. 在 Cloud Studio 中导入本仓库（或上传项目文件）
2. Cloud Studio 会自动读取 `.cloudstudio` 配置
3. 首次运行会自动执行 `npm install` 安装依赖
4. 执行 `npm run dev -- --host 0.0.0.0` 启动开发服务器
5. 访问 `http://<your-cloud-studio-host>:5173` 预览

### 生产模式部署（推荐）

如需以生产模式部署（构建后预览），修改 `.cloudstudio` 中的 `cmd`：

```toml
cmd = "npm run build && npm run preview -- --host 0.0.0.0 --port 5173"
```

或使用静态文件服务器：

```toml
cmd = "npm run build && npx serve dist -l 5173"
```

## 通用静态托管部署

本项目构建后产出纯静态文件（`dist/`），可部署到任何静态托管平台。

### 构建

```bash
npm install
npm run build
```

构建产物在 `dist/` 目录。

### 部署到 Vercel / Netlify / GitHub Pages / EdgeOne Pages

将 `dist/` 目录部署到任意静态托管平台即可，无需服务端运行时。

| 平台 | 构建命令 | 输出目录 |
|------|---------|---------|
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |
| GitHub Pages | `npm run build` | `dist` |
| EdgeOne Pages | `npm run build` | `dist` |

### 本地预览构建产物

```bash
npm run build
npm run preview
# 或
npx serve dist -l 5173
```

## 环境要求

- Node.js >= 18
- npm >= 9
