# 🚀 Cloudflare Pages & Workers 部署指南

本指南根据 [OpenNext 官方文档](https://opennext.js.org/cloudflare/get-started) 重构，详细说明如何将 Weather in Calendar 应用部署到 Cloudflare。

## 📋 前置要求

1. **Cloudflare 账号**
   - 访问 [cloudflare.com](https://cloudflare.com)
2. **本地环境**
   - Node.js 18.17 或更高版本
   - 必须安装最新版 `@opennextjs/cloudflare` 和 `wrangler`

## 🔨 本地构建与预览

### 1. 构建应用

```bash
npm run build:cloudflare
```

该命令会调用 `opennextjs-cloudflare build`，生成 `.open-next` 目录：
- `.open-next/worker.js`: 核心 Worker 逻辑
- `.open-next/assets`: 静态资源文件

### 2. 本地预览

在部署前，可以使用 Workers 运行时本地预览：

```bash
npm run preview:cloudflare
```

访问控制台输出的本地 URL 查看应用。

## 🌐 部署流程

### 命令行部署 (推荐)

1. **登录 Cloudflare** (如果未登录):
   ```bash
   npx wrangler login
   ```

2. **执行部署**:
   ```bash
   npm run deploy:cloudflare
   ```

### 环境变量配置

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com) -> Workers & Pages -> 你的项目。
2. 进入 **Settings** -> **Variables**。
3. 添加以下变量（如果使用和风天气 API）：
   - `QWEATHER_API_KEY`
   - `QWEATHER_API_HOST`

## ⚙️ 类型安全 (Typegen)

如果你在代码中使用了 Cloudflare 绑定（如环境变量），运行以下命令生成类型定义：

```bash
npm run cf-typegen
```

## 🐛 常见问题

### 1. 部署失败提示 "Configuration file for Pages projects does not support 'build'"
**解决**: 确保 `wrangler.toml` 中没有 `[build]` 章节。所有构建指令应通过 CLI 执行或在 Dashboard 中配置。

### 2. 静态页面 404
**解决**: 确保 `next.config.ts` 中设置了 `trailingSlash: true`，这是 Cloudflare 路由机制的推荐配置。

### 3. 构建命令检测错误
**注意**: 在 Cloudflare Dashboard 的构建设置中，建议将 **Build command** 设为 `npm run build:cloudflare`，并将 **Build output directory** 改为 `.open-next` (OpenNext 默认输出目录)。

---
> 详情请参考官方文档: [opennext.js.org/cloudflare](https://opennext.js.org/cloudflare/get-started)
