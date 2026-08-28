#!/usr/bin/env bash
# Md2GZH 一键部署：rsync 静态文件到服务器
# 用法: ./deploy.sh user@服务器IP [目标目录]
# 前置: 服务器已装 nginx，目标目录为 nginx root（见 README「服务器部署」）
set -euo pipefail

TARGET=${1:?用法: ./deploy.sh user@服务器IP [/var/www/md2gzh]}
DIR=${2:-/var/www/md2gzh}

rsync -avz --delete \
  --exclude node_modules/ \
  --exclude .git/ \
  --exclude "*.md" \
  --exclude test.js \
  ./ "$TARGET:$DIR/"

ssh "$TARGET" "nginx -t && systemctl reload nginx"
echo "✅ 部署完成: http://${TARGET#*@}/"
