# 🚀 Vercel 部署指南

## 前置条件

- ✅ GitHub 仓库已创建
- ✅ Vercel 账号（免费注册：https://vercel.com/signup）

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "feat: Add Vercel deployment support with API routes"
git push origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [https://vercel.com/new](https://vercel.com/new)
2. 点击 "Import Git Repository"
3. 选择 `weather-in-calendar` 仓库
4. 点击 "Import"

### 3. 配置项目

Vercel 会自动检测 Next.js 项目，点击 **Deploy** 按钮。

**Vercel 配置：**
- Framework: Next.js（自动检测）
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

这些配置会从 `vercel.json` 文件自动读取。

### 4. 部署完成

等待 1-2 分钟，部署完成后你会看到：

```
✅ Production: https://your-app.vercel.app
```

## 🎯 测试 API 端点

部署完成后，测试 webcal 订阅：

### 英文版
```
webcal://your-app.vercel.app/api/ics?city=New%20York&locale=en
```

### 中文版
```
webcal://your-app.vercel.app/api/ics?city=%E7%A6%8F%E5%B7%9E&locale=zh
```

## 🔧 环境变量（可选）

在 Vercel 项目设置中添加环境变量：

1. 访问项目 Settings > Environment Variables
2. 添加以下变量（未来集成真实天气 API 时需要）：

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

3. 点击 Save

## 📊 Vercel 特性

### 自动部署
- 推送到 `main` 分支自动触发部署
- Pull request 创建预览环境
- 每次部署都有独立 URL

### 性能优化
- 全球 CDN（40+ 个数据中心）
- Edge Functions（边缘计算）
- 自动 HTTPS
- 零配置缓存

### 免费额度

- 100GB 带宽/月
- 无限请求（合理使用）
- 6,000 分钟构建时间/月
- 100GB-Hours 边缘函数执行/月

## 🐛 故障排除

### 构建失败

检查：
1. Node.js 版本是否 >= 18.17
2. `package.json` 依赖是否正确安装
3. Vercel Dashboard 的构建日志

### API 路由 404

确保：
1. `next.config.ts` 中没有 `output: 'export'`
2. `/api/ics/route.ts` 文件存在
3. 重新部署项目

### Webcal 订阅不工作

检查：
1. URL 编码是否正确（城市名）
2. 日历应用是否支持 webcal:// 协议
3. 网络连接是否正常
4. 测试直接访问：`https://your-app.vercel.app/api/ics?city=...`

## 📱 用户体验流程

1. 用户访问：`https://your-app.vercel.app/zh`
2. 输入城市名："福州"
3. 点击"订阅日历"
4. 浏览器打开：`webcal://your-app.vercel.app/api/ics?city=%E7%A6%8F%E5%B7%9E&locale=zh`
5. 日历应用显示："是否订阅日历？"
6. 点击"订阅"
7. 完成！未来 14 天天气预报会在日历中显示

## 🎉 完成！

你的应用现在部署在 Vercel 上，支持：
- ✅ 多语言前端（中文/英文）
- ✅ 动态 ICS 文件生成
- ✅ webcal 日历订阅
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 持续集成部署

需要帮助？查看 [Vercel 文档](https://vercel.com/docs) 或检查 [Vercel 社区](https://vercel.com/community)。