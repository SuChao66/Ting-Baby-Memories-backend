# ============================================
# 后端 Dockerfile - 多阶段构建
# ============================================

# ---- Stage 1: 构建 TypeScript ----
FROM node:22-alpine AS builder
WORKDIR /app

# 安装 pnpm v9（与本地 lockfile 版本匹配）
RUN npm install -g pnpm@9

# 先复制依赖文件，利用 Docker 缓存
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源码并编译
COPY . .
RUN pnpm run build

# ---- Stage 2: 生产运行 ----
FROM node:22-alpine
WORKDIR /app

RUN npm install -g pnpm@9

# 只安装生产依赖（builder 阶段已验证 lockfile，此处无需 frozen）
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# 复制编译产物
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
