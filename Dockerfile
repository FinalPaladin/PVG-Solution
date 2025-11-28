# Dockerfile cho ứng dụng Frontend PVG-FE (Sử dụng Multi-Stage Build)

# ========== BUILD STAGE (Giai đoạn xây dựng) ==========
FROM node:20 AS build
WORKDIR /app

# 1. Cấu hình Timezone (Giữ nguyên)
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 2. Bật corepack để dùng pnpm (Giữ nguyên)
RUN corepack enable

# 3. CHỈ COPY CÁC FILE CẦN THIẾT ĐỂ CÀI ĐẶT DEPENDENCIES
# Dựa trên cấu trúc: PVG-FE/PVGSolution/{package.json, pnpm-lock.yaml}
# Copy file package.json và pnpm-lock.yaml từ PVGSolution vào thư mục làm việc /app
COPY PVGSolution/package.json PVGSolution/pnpm-lock.yaml* ./

# 4. Cài đặt dependencies
RUN pnpm install --frozen-lockfile

# 5. COPY TOÀN BỘ CODE NGUỒN CỦA PVGSolution
# Copy nội dung bên trong thư mục PVGSolution sang thư mục làm việc /app
# Điều này đảm bảo tsconfig.json và các file khác nằm ở /app
COPY PVGSolution/ .

# 6. Build Vite (Bây giờ đã tìm thấy tsconfig.json ở /app)
RUN pnpm build


# ========== RUNNER STAGE (Giai đoạn chạy ứng dụng) ==========
FROM node:20-slim AS runner
WORKDIR /app

# 1. Cấu hình Timezone (Giữ nguyên)
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 2. Cài đặt web server nhẹ (dùng node:20-slim để giảm kích thước)
RUN npm install -g serve

# 3. Copy thư mục "dist" đã được build từ stage "build"
COPY --from=build /app/dist ./dist

# 4. Khai báo cổng lắng nghe
EXPOSE 4173

# 5. Lệnh chạy ứng dụng
CMD ["serve", "-s", "dist", "-l", "4173"]