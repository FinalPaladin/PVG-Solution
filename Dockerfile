# ========== build stage ==========
FROM node:20 AS build
WORKDIR /app

# Timezone HCM
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Dùng pnpm
RUN corepack enable

# Copy file config pnpm
COPY PVGSolution/package.json PVGSolution/pnpm-lock.yaml* ./

# Cài deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build Vite
RUN pnpm build

# ========== run stage ==========
FROM node:20 AS runner
WORKDIR /app

# Timezone HCM
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Dùng "serve" để serve static file
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
