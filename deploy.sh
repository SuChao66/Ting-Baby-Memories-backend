#!/bin/bash
# 一键部署脚本（服务器端使用）
# 用法: ./deploy.sh
# 前置: 服务器已安装 Node 22+、PM2、MongoDB

set -e

# === 配置（按需修改）===
APP_NAME="ting-baby"
APP_DIR="/opt/ting-baby"
BRANCH="main"
# ========================

cd "$APP_DIR"

echo "[1/5] 拉取最新代码..."
git pull origin "$BRANCH"

echo "[2/5] 安装依赖..."
npm ci

echo "[3/5] 编译 TypeScript..."
npm run build

echo "[4/5] 检查 .env 文件..."
if [ ! -f .env ]; then
  echo "  [警告] .env 不存在，请手动创建"
  exit 1
fi

echo "[5/5] 重启 PM2..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start dist/server.js --name "$APP_NAME" -- --env production
  pm2 startup
  pm2 save
fi

echo ""
echo "部署完成！"
echo "  查看日志: pm2 logs $APP_NAME"
echo "  查看状态: pm2 list"
