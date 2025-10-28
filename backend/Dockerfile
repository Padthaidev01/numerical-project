# ใช้ Node.js เวอร์ชัน 18 เป็นพื้นฐาน
FROM node:18-alpine

# ตั้งค่า Working Directory ภายใน Container
WORKDIR /app

# คัดลอกแค่ package.json และ package-lock.json เข้าไปก่อน
COPY package*.json ./

# ติดตั้ง dependencies (npm install)
RUN npm install

# คัดลอกไฟล์โค้ดที่เหลือทั้งหมดเข้าไป
COPY . .

# บอก Docker ว่า Container นี้จะใช้พอร์ต 4000
EXPOSE 4000

# คำสั่งที่จะรันเมื่อ Container เริ่มทำงาน
CMD ["node", "server.js"]