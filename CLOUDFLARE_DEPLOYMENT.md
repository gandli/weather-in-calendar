# 🚀 Cloudflare Pages 部署指南

本指南详细说明如何将 Weather in Calendar 应用部署到 Cloudflare Pages。

## 📋 前置要求

1. **Cloudflare 账号**
   - 访问 [cloudflare.com](https://cloudflare.com) 注册免费账号
   - 免费套餐包含:
     - 每月 100,000 次请求
     - 全球 CDN 加速
     - 自动 HTTPS

2. **本地环境**
   - Node.js 18.17 或更高版本
   - Bun 包管理器(推荐)或 npm

## 🔧 本地构建与预览

### 1. 构建应用

使用 OpenNext Cloudflare 适配器构建应用:

```bash
npm run build:cloudflare
```

或使用 bun:

```bash
bun run build:cloudflare
```

构建完成后,会在项目根目录生成 `.worker-next` 目录,包含所有部署所需文件。

### 2. 本地预览

在部署前,可以在本地预览 Cloudflare 构建版本:

```bash
npm run preview:cloudflare
```

访问 `http://localhost:8788` 查看应用。

## 🌐 部署到 Cloudflare Pages

### 方式一: 使用 Wrangler CLI(推荐)

#### 1. 登录 Cloudflare

```bash
bunx wrangler login
```

这将打开浏览器,完成 OAuth 授权。

#### 2. 部署应用

```bash
npm run deploy:cloudflare
```

首次部署时,Wrangler 会提示创建新项目:
- 项目名称: `weather-in-calendar`(或自定义)
- 生产分支: `main`

#### 3. 配置环境变量

如果使用了和风天气 API,需要在 Cloudflare 控制台配置环境变量:

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → 选择你的项目
3. 点击 **Settings** → **Environment variables**
4. 添加以下变量:
   - `QWEATHER_API_KEY`: 你的和风天气 API Key
   - `QWEATHER_API_HOST`: API 主机地址

或使用命令行:

```bash
bunx wrangler pages secret put QWEATHER_API_KEY
bunx wrangler pages secret put QWEATHER_API_HOST
```

### 方式二: 通过 Cloudflare Dashboard

#### 1. 连接 Git 仓库

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application**
3. 选择 **Pages** → **Connect to Git**
4. 授权并选择你的仓库

#### 2. 配置构建设置

> [!IMPORTANT]
> **必须手动修改构建命令**
> 
> Cloudflare 默认的 "Next.js" 预设会强制使用旧版的 `next-on-pages`。请务必将 **Build command** 更改为 `npm run build:cloudflare`。

- **Framework preset**: `None` (或保持 Next.js 但修改下方命令)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `.worker-next`
- **Root directory**: `/` (默认)

#### 3. 设置环境变量

在构建配置页面添加:
- `QWEATHER_API_KEY`
- `QWEATHER_API_HOST`

#### 4. 部署

点击 **Save and Deploy**,Cloudflare 会自动:
- 拉取代码
- 执行构建
- 部署到全球 CDN

## 🔄 持续部署

### Git 集成自动部署

如果使用方式二连接了 Git 仓库,每次推送到主分支都会自动触发部署:

```bash
git add .
git commit -m "Update weather feature"
git push origin main
```

### 手动部署更新

如果使用方式一(CLI),每次更新后重新运行:

```bash
npm run build:cloudflare
npm run deploy:cloudflare
```

## 🌍 自定义域名

### 1. 添加域名

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 **Custom domains** → **Set up a custom domain**
3. 输入你的域名(如 `weather.example.com`)

### 2. 配置 DNS

Cloudflare 会自动添加 CNAME 记录指向你的 Pages 项目。

### 3. HTTPS

Cloudflare 自动为自定义域名提供免费 SSL 证书。

## 📊 监控与日志

### 查看部署日志

在 Cloudflare Dashboard 中:
- **Deployments** 标签页查看部署历史
- 点击具体部署查看构建日志

### 实时日志

使用 Wrangler 查看实时日志:

```bash
bunx wrangler pages deployment tail
```

### 分析数据

在 **Analytics** 标签页查看:
- 请求数量
- 带宽使用
- 错误率
- 响应时间

## ⚙️ 高级配置

### 自定义 Wrangler 配置

编辑 `wrangler.toml` 文件:

```toml
name = "weather-in-calendar"
compatibility_date = "2024-01-01"

pages_build_output_dir = ".worker-next"

[observability]
enabled = true

# 自定义路由规则
[[routes]]
pattern = "/api/*"
zone_name = "example.com"
```

### 环境特定配置

为不同环境(生产/预览)设置不同的环境变量:

```bash
# 生产环境
bunx wrangler pages secret put QWEATHER_API_KEY --env production

# 预览环境
bunx wrangler pages secret put QWEATHER_API_KEY --env preview
```

## 🐛 常见问题

### 构建失败

**问题**: `Error: Cannot find module '@opennextjs/cloudflare'`

**解决**:
```bash
npm install -D @opennextjs/cloudflare
```

### API 路由 404

**问题**: API 路由返回 404

**原因**: Cloudflare Pages 的路由规则与 Vercel 不同

**解决**: 确保 `next.config.ts` 中设置了 `trailingSlash: true`

### 环境变量未生效

**问题**: 环境变量在运行时为 undefined

**解决**:
1. 确认在 Cloudflare Dashboard 中正确设置了环境变量
2. 重新部署应用使变量生效
3. 检查变量名是否与代码中一致

### 图片加载失败

**问题**: 图片无法显示

**解决**: 确保 `next.config.ts` 中设置了:
```typescript
images: {
  unoptimized: true
}
```

## 📚 相关资源

- [OpenNext Cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

## 🆚 Vercel vs Cloudflare Pages

| 特性 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| **免费额度** | 100GB 带宽/月 | 无限带宽 |
| **构建时间** | 6000 分钟/月 | 500 次构建/月 |
| **边缘节点** | 全球 CDN | 全球 CDN(更多节点) |
| **冷启动** | 较快 | 极快 |
| **价格** | $20/月起 | $5/月起 |
| **Next.js 支持** | 原生支持 | 通过 OpenNext |

---

部署完成后,你的应用将在 `https://<project-name>.pages.dev` 上线! 🎉
