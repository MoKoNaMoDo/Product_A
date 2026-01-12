# Reusable Product Catalog Template (Thai/English)

## 📌 ภาพรวมโครงการ (Project Overview)
เทมเพลตเว็บไซต์แคตตาล็อกสินค้าที่ออกแบบมาให้ "ทำความเข้าใจง่าย" สำหรับนักพัฒนา Junior เน้นโครงสร้างที่สะอาด (Clean Architecture) ปรับแก้ไขง่าย และรองรับการขยายผล

### ✨ ฟีเจอร์หลัก (Features)
- **ระบบ 2 ภาษา**: รองรับภาษาไทยและอังกฤษ (TH/EN)
- **Catalog Mode**: แสดงสินค้าแบบแคตตาล็อก (ไม่มีตะกร้าสินค้า) เน้นให้ลูกค้าติดต่อ
- **Admin Panel**: ระบบหลังบ้านสำหรับจัดการสินค้า เนื้อหาหน้าเว็บ และข้อมูลบริษัท
- **Theme**: ดีไซน์ทันสมัย สบายตา (เขียว/ฟ้า/ขาว)
- **Resposive**: รองรับการแสดงผลบนมือถือ

---

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express.js (Modular Structure)
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
/project-root
├── /client           # Frontend Application (Next.js)
│   ├── /app          # Pages logic & Routing
│   ├── /components   # UI Components
│   └── /lib          # Utilities (API, Helper)
│
├── /server           # Backend API (Express.js)
│   ├── /controllers  # Request Handlers (Logic)
│   ├── /services     # Business Logic
│   ├── /routes       # API Routes definition
│   ├── /models       # Database Queries
│   └── /config       # Configurations
│
├── /database         # Database Scripts
│   └── init.sql      # Initial Table & Seed Data
│
└── docker-compose.yml # Service Orchestration
```

## 🚀 การติดตั้งและใช้งาน (Installation)

1. **Prerequisites**: ติดตั้ง Docker และ Docker Desktop
2. **Start Project**:
   ```bash
   docker-compose up --build
   ```
3. **Access**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - Database: `localhost:5432`

---

## 🎨 Design System
- **Primary Colors**: Green (ธรรมชาติ/ความปลอดภัย), Blue (ความน่าเชื่อถือ), White (สะอาด/สบายตา)
- **Font**: Inter / Sarabun (สำหรับภาษาไทย)
