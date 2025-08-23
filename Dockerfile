# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 暴露端口（如果需要）
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 运行应用
CMD ["npm", "start"]