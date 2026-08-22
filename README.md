# 光遇交友 - 旅人社交平台

纯前端静态网站，所有数据存储在浏览器 localStorage 中，无需后端服务器。

## 功能特性

- 🔐 用户注册/登录/访客模式
- 💬 光语信箱（留言、点赞、回复、标签筛选、搜索）
- 📷 追光长廊（截图上传、瀑布流、灯箱、点赞、收藏、评论）
- 👤 个人中心（名片、账号设置、我的上传/收藏/留言、成就、私信）
- 🔧 管理后台（数据概览、照片审核、留言管理、用户管理、举报处理、活码管理）
- 🔥 互心互火专区
- 👑 复刻先祖信息板
- 📋 每日任务打卡
- 🏆 星光排行榜
- 🎵 音乐播放器
- 🌙 暗色主题
- 📱 移动端优先适配

## 管理员账号

- 用户名：`admin`
- 密码：`admin123`

## GitHub Pages 部署步骤

1. **注册 GitHub 账号**：访问 https://github.com 注册
2. **创建新仓库**：点击右上角 `+` → `New repository`，填写仓库名（如 `guangyu-friends`），选择 Public，点击 Create
3. **上传文件**：进入仓库 → 点击 `Add file` → `Upload files` → 将本项目所有文件（index.html、api-mock.js、favicon.svg）拖入 → 点击 `Commit changes`
4. **开启 Pages**：点击 `Settings` → 左侧 `Pages` → Source 选择 `Deploy from a branch` → Branch 选择 `main` / `(root)` → 点击 `Save`
5. **访问网站**：等待约 1 分钟，访问 `https://你的用户名.github.io/仓库名/`

## 注意事项

- 数据存储在浏览器 localStorage，清除浏览器缓存会丢失数据
- 数据不跨设备同步，每台设备独立
- 适合个人演示和小型社区使用
