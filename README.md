

#  E-Learning Platform – Online Courses Platform

**A Complete E-Learning System with Multi-Role Management**

منصة تعليم إلكتروني متكاملة تدعم إدارة الكورسات، المواعيد، والتقارير بطريقة احترافية مع أنظمة أمان وإشعارات متقدمة.

---

## نظرة عامة على المشروع

تم تطوير منصة تعليم إلكتروني كاملة تتيح للأدمن والمدربين إدارة الكورسات والمواعيد، مع دعم كامل للطلاب. المشروع يركز على تجربة مستخدم سلسة، أمان عالي، ومميزات إدارية متقدمة.

### أبرز الإنجازات
- لوحة تحكم للأدمن والمدربين (Instructor Dashboard)
- إدارة الكورسات والمواعيد (Appointments)
- نظام مصادقة آمن بـ JWT مع التحقق من البريد الإلكتروني
- إدارة نتائج الاختبارات والتقارير (Lab/Test Results)
- رفع الملفات + تقارير آلية + إشعارات فورية
- تصدير البيانات إلى CSV و Excel

---

## ✨ المميزات الرئيسية

### 🔐 Authentication & Security
- JWT-based Authentication
- Fine-grained Access Control (RBAC)
- Email Verification Workflow
- Idempotent Request Handling (منع التكرار)

### 📖 Core Features
- Admin & Instructor Dashboards
- Course Management (Create, Update, Publish)
- Appointments / Scheduling System
- File Uploads for Documents & Results
- Automated Report Generation

### 📬 Real-time & Notifications
- Real-time Notifications using Socket.IO
- Email Alerts to Students & Instructors
- Instant updates on enrollment and results

### 📊 Reporting & Export
- Export enrollment data to **CSV** and **Excel**
- Scalable reporting using `fast-csv` and `ExcelJS`
- Advanced filtering and analytics

---

## 🛠️ Tech Stack

| الطبقة              | التقنية                              |
|---------------------|--------------------------------------|
| Backend             | NestJS + TypeScript                 |
| Database            | PostgreSQL                          |
| ORM                 | Prisma                              |
| Authentication      | JWT                                 |
| Real-time           | Socket.IO                           |
| File Handling       | Multer / Cloudinary                 |
| Reporting           | fast-csv, ExcelJS                   |
| Email               | Nodemailer                          |

---

## 🧠 التحديات الهندسية التي تم حلها

- تنفيذ **Role-Based Access Control** دقيق (Admin, Instructor, Student)
- إدارة رفع الملفات وتوليد التقارير بشكل آلي
- Real-time Notifications مع ضمان عدم التكرار (Idempotency)
- تصدير بيانات كبيرة بكفاءة عالية
- Email Verification & Secure Authentication Flow

---

## 📁 هيكل المشروع
