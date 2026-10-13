# Giai đoạn 1: Build ứng dụng
FROM node:20-alpine AS builder

WORKDIR /app

# Khai báo và cài đặt dependencies trước để tận dụng Docker cache
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn và thực hiện build
COPY . .
RUN npm run build 

# Giai đoạn 2: Môi trường chạy (Production)
FROM nginx:alpine

# Xóa các file tĩnh mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Sao chép thư mục đã build từ Giai đoạn 1 sang thư mục phục vụ của Nginx
# Lưu ý: Nếu dự án dùng Vite, thư mục đích thường là /app/dist.
# Nếu dùng Create React App, hãy đổi /app/dist thành /app/build.
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Chạy Nginx ở foreground
CMD ["nginx", "-g", "daemon off;"]