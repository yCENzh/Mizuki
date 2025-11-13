# Mizuki 部署指南

本文档提供 Mizuki 博客在各个平台的部署配置说明。

## 📖 目录

- [部署前准备](#-部署前准备)
- [GitHub Pages 部署](#-github-pages-部署)
- [Vercel 部署](#-vercel-部署)
- [Netlify 部署](#-netlify-部署)
- [Cloudflare Pages 部署](#-cloudflare-pages-部署)
- [故障排查](#-故障排查)

---

## 🚀 部署前准备

### 基础配置

1. **更新站点 URL**

编辑 `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://your-domain.com',  // 更新为你的域名
  // ...
});
```

2. **配置环境变量** (可选)

如果使用内容分离功能，需要配置：
- `ENABLE_CONTENT_SYNC=true`
- `CONTENT_REPO_URL=你的内容仓库地址`
- `USE_SUBMODULE=true`

详见 [内容分离完整指南](./CONTENT_SEPARATION.md)

---

## 📦 GitHub Pages 部署

### 自动部署 (推荐)

项目已配置好 GitHub Actions 工作流，推送到 `main` 分支会自动部署。

#### 本地模式 (默认)

**无需任何配置**，开箱即用：

1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `pages` / `root`
3. 等待 Actions 完成部署

#### 内容分离模式

**配置步骤**:

1. **添加仓库 Secrets**:
   - Settings → Secrets and variables → Actions → New repository secret
   - 添加 `CONTENT_REPO_URL`: `https://github.com/your-username/Mizuki-Content.git`

2. **修改 `.github/workflows/deploy.yml`**:

取消注释环境变量部分:
```yaml
- name: Build site
  run: pnpm run build
  env:
    ENABLE_CONTENT_SYNC: true
    CONTENT_REPO_URL: ${{ secrets.CONTENT_REPO_URL }}
    USE_SUBMODULE: true
```

3. **私有内容仓库配置**:

**同账号私有仓库** (推荐):
- 无需额外配置
- 自动使用 `GITHUB_TOKEN` 访问

**跨账号私有仓库 (SSH)**:
```yaml
# 添加 SSH 配置步骤
- name: Setup SSH Key
  uses: webfactory/ssh-agent@v0.8.0
  with:
    ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: true
```

在 Secrets 中添加:
- `SSH_PRIVATE_KEY`: SSH 私钥内容
- `CONTENT_REPO_URL`: `git@github.com:other-user/repo.git`

**跨账号私有仓库 (Token)**:
```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: true
    token: ${{ secrets.PAT_TOKEN }}

- name: Build site
  run: pnpm run build
  env:
    ENABLE_CONTENT_SYNC: true
    CONTENT_REPO_URL: https://${{ secrets.PAT_TOKEN }}@github.com/other-user/repo.git
    USE_SUBMODULE: true
```

在 Secrets 中添加:
- `PAT_TOKEN`: GitHub Personal Access Token (需要 `repo` 权限)

### 工作流说明

项目包含三个工作流:

| 工作流 | 触发条件 | 功能 |
|--------|---------|------|
| `build.yml` | Push/PR 到 main | CI 测试，检查构建 |
| `deploy.yml` | Push 到 main | 构建并部署到 pages 分支 |
| `biome.yml` | Push/PR | 代码格式和质量检查 |

---

## 🔷 Vercel 部署

### 快速部署

1. **连接仓库**:
   - 访问 [Vercel](https://vercel.com)
   - Import Git Repository
   - 选择你的 Mizuki 仓库

2. **配置项目**:
   - Framework Preset: Astro
   - Build Command: `pnpm build` (默认)
   - Output Directory: `dist` (默认)

3. **部署**:
   - 点击 Deploy 开始部署

### 部署模式

#### 本地模式

**无需配置环境变量**，使用默认的 `vercel.json`。

#### 内容分离模式 - 公开仓库

在 Vercel 项目设置中添加环境变量:

| 变量名 | 值 |
|-------|---|
| `ENABLE_CONTENT_SYNC` | `true` |
| `CONTENT_REPO_URL` | `https://github.com/your-username/Mizuki-Content.git` |
| `USE_SUBMODULE` | `true` |

#### 内容分离模式 - 私有仓库

**方式 A: 授权 Vercel 访问**
- 在连接 GitHub 仓库时，确保授权包括内容仓库的访问权限

**方式 B: 使用 Token**

添加环境变量:
```
ENABLE_CONTENT_SYNC=true
GITHUB_TOKEN=ghp_your_personal_access_token
CONTENT_REPO_URL=https://${GITHUB_TOKEN}@github.com/your-username/Mizuki-Content-Private.git
USE_SUBMODULE=true
```

### 配置文件

项目包含两个 Vercel 配置文件:

- `vercel.json` - 默认配置，适用于本地模式
- `vercel-with-content.json.example` - 内容分离示例 (可选)

**注意**: 使用默认 `vercel.json` 即可，通过环境变量控制是否启用内容分离。

---

## 🌐 Netlify 部署

### 部署步骤

1. **连接仓库**:
   - 访问 [Netlify](https://www.netlify.com)
   - New site from Git
   - 选择你的 Mizuki 仓库

2. **配置构建**:
   - Build command: `pnpm build`
   - Publish directory: `dist`

3. **环境变量** (如果使用内容分离):

在 Site settings → Environment variables 中添加:
```
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

4. **私有仓库配置**:

在 Site settings → Build & deploy → Deploy key 中添加有权限访问私有仓库的 SSH 密钥。

### netlify.toml 配置

可选：创建 `netlify.toml` 文件：

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "9"
  # 如果使用内容分离
  ENABLE_CONTENT_SYNC = "true"
  CONTENT_REPO_URL = "https://github.com/your-username/Mizuki-Content.git"
  USE_SUBMODULE = "true"
```

---

## ☁️ Cloudflare Pages 部署

### 部署步骤

1. **连接仓库**:
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Workers & Pages → Create application → Pages
   - Connect to Git

2. **配置构建**:
   - Framework preset: Astro
   - Build command: `pnpm build`
   - Build output directory: `dist`

3. **环境变量** (如果使用内容分离):

添加以下变量:
```
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=false  # ⚠️ Cloudflare Pages 默认不支持 submodule
```

### 注意事项

⚠️ Cloudflare Pages 默认不支持 Git Submodule，建议:
- 使用独立仓库模式: `USE_SUBMODULE=false`
- 或在构建命令中手动初始化: `git submodule update --init && pnpm build`

---

## 🔄 自动同步机制

所有部署平台都使用相同的自动同步机制：

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-content.js || true"
  }
}
```

**工作原理**:
1. `pnpm build` 执行前自动运行 `prebuild` 钩子
2. 检查 `ENABLE_CONTENT_SYNC` 环境变量
3. 如果为 `true`，从远程仓库同步内容到 `src/content/` 和 `public/images/`
4. 如果为 `false` 或未设置，跳过同步，使用本地内容
5. `|| true` 确保同步失败不会中断构建

**优势**:
- ✅ 统一的构建命令，无需修改配置
- ✅ 自动兼容所有部署模式
- ✅ 同步失败不影响构建（回退到本地内容）

---

## 🔍 故障排查

### 问题 1: 部署失败 - "未设置 CONTENT_REPO_URL"

**原因**: 启用了内容分离但未配置仓库地址

**解决**:
1. 检查环境变量中是否设置了 `ENABLE_CONTENT_SYNC=true`
2. 检查是否设置了 `CONTENT_REPO_URL`
3. 或将 `ENABLE_CONTENT_SYNC` 设置为 `false` 使用本地内容

### 问题 2: 私有仓库认证失败

**GitHub Actions**:
- **同账号**: 确保使用 `${{ secrets.GITHUB_TOKEN }}`
- **跨账号**: 配置 SSH 密钥或 PAT Token

**Vercel/Netlify**:
- 确保授权了私有仓库访问
- 或使用 Token 方式: `https://TOKEN@github.com/user/repo.git`

### 问题 3: Submodule 克隆失败

**检查**:
1. 确认部署平台支持 Git Submodule
2. 检查 SSH 密钥或 Token 配置
3. 尝试使用独立仓库模式: `USE_SUBMODULE=false`

### 问题 4: 构建成功但内容未更新

**检查**:
1. 查看构建日志，确认同步步骤执行
2. 检查 `ENABLE_CONTENT_SYNC` 是否设置为 `true`
3. 验证 `CONTENT_REPO_URL` 是否正确
4. 清除部署平台的缓存并重新部署

### 问题 5: 部署时间过长

**优化建议**:
- 使用 Git Submodule 模式 (更快)
- 启用部署平台的缓存机制
- 优化图片大小和数量

---

## 📋 环境变量参考

| 变量名 | 必需 | 默认值 | 说明 |
|-------|------|--------|------|
| `ENABLE_CONTENT_SYNC` | ❌ | `false` | 是否启用内容分离功能 |
| `CONTENT_REPO_URL` | ⚠️ | - | 内容仓库地址 (启用内容分离时必需) |
| `USE_SUBMODULE` | ❌ | `false` | 是否使用 Git Submodule 模式 |
| `CONTENT_DIR` | ❌ | `./content` | 内容目录路径 |
| `UMAMI_API_KEY` | ❌ | - | Umami 统计 API 密钥 |
| `BCRYPT_SALT_ROUNDS` | ❌ | `12` | bcrypt 加密轮数 |

⚠️ = 在特定模式下必需

---

## 💡 推荐配置

### 个人博客
- **平台**: Vercel 或 GitHub Pages
- **模式**: 本地模式（最简单）
- **配置**: 无需环境变量

### 团队协作
- **平台**: 任意
- **模式**: 内容分离 - 私有仓库
- **配置**: 启用内容分离 + SSH 认证

### 多站点部署
- **平台**: 多个平台同时部署
- **模式**: 内容分离 - 公开仓库
- **配置**: 统一的环境变量配置

---

## 📚 相关文档

- [内容分离完整指南](./CONTENT_SEPARATION.md) - 详细的内容分离配置
- [内容迁移指南](./MIGRATION_GUIDE.md) - 从单仓库迁移到分离模式
- [内容仓库结构](./CONTENT_REPOSITORY.md) - 内容仓库的组织方式

---

💡 **建议**: 如果是第一次部署，推荐先使用本地模式熟悉流程，之后再根据需要启用内容分离功能。
