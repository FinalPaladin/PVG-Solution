# ========== BUILD STAGE ==========
FROM node:20 AS build
WORKDIR /app

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN corepack enable

# Copy dependency files
COPY PVGSolution/package.json PVGSolution/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY PVGSolution/ .

# Build Vite
RUN pnpm build


# ========== RUNTIME STAGE ==========
FROM nginx:alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
