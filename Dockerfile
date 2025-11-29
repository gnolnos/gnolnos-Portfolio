# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR /app

# 1. Copy file quản lý thư viện trước
COPY package*.json ./

# 2. Cài đặt thư viện (Bao gồm React, Tailwind, Lucide)
RUN npm install
# Ép buộc cài lại Tailwind để chắc chắn
RUN npm install -D tailwindcss postcss autoprefixer

# 3. [QUAN TRỌNG] Copy toàn bộ source code VÀ file config (tailwind.config.js...)
COPY . .

# 4. Build ứng dụng (Tailwind sẽ chạy ở bước này)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cấp quyền đọc file
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
