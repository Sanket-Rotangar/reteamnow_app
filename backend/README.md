# ReteamNow Backend API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.10-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io)](https://socket.io/)

**RESTful API server for the ReteamNow employee engagement platform.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Development](#-development)

---

## 🚀 Overview

ReteamNow Backend is the server-side component of the ReteamNow employee engagement platform. Built with Node.js, Express, and MongoDB, it provides a comprehensive REST API for:

- **User management & authentication** (JWT-based, role-based access control)
- **Attendance tracking** with check-in/check-out and history
- **Survey & compliance management** with dynamic question generation using AI
- **Team collaboration** (comments, announcements, chat via Socket.IO)
- **Asset & resource management** (booking, allocation, acknowledgment)
- **Event management & competitions** (Fun Zone)
- **Feedback & reviews** system
- **Notifications** (in-app and email)
- **Health & wellness** (WFH tracking, birthday/anniversary reminders)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with token expiry handling
- Role-based access control (Super Admin, Admin, Employee)
- Google OAuth integration support
- Password reset with secure tokens

### 👥 User Management
- CRUD operations for users and admins
- Bulk user import from Excel/CSV
- Workspace-based multi-tenant architecture
- Profile management with avatar uploads

### 📊 Attendance
- Check-in / check-out with geolocation validation
- Monthly attendance analytics with streak tracking
- Overtime calculation and history

### 📝 Surveys & Compliance
- Dynamic survey creation and distribution
- AI-powered question generation (Gemini API)
- Compliance testing with auto-grading
- Survey analytics and reporting
- Team-based survey assignment

### 💬 Communication
- Real-time chat via Socket.IO
- Company-wide announcements
- Comment threads on actions and events
- In-app notification system
- Email notifications (Nodemailer)

### 🎯 Events & Competitions
- Create and manage events
- Competition/Fun Zone with posts, likes, and comments
- Attendance tracking for events

### 📦 Asset & Resource Management
- Asset inventory tracking
- Resource booking and allocation
- Asset acknowledgment workflow
- Type of work categorization

### 📈 Analytics & Reporting
- Survey response analytics
- Attendance dashboards
- Custom analytics endpoints

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Apps                          │
│         (React Native Mobile App / Web Frontend)            │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTPS / WebSocket
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express REST API (app.js)                  │
├───────────────┬──────────────────┬──────────────────────────┤
│  Middleware   │    Routes        │    Socket.IO             │
│  - Auth JWT   │  - /api/auth    │  - Real-time events      │
│  - CORS       │  - /api/user    │  - Notifications         │
│  - Rate Limit │  - /api/survey  │  - Chat                  │
│  - Validation │  - /api/event   │                          │
│  - Error      │  - ... 60+      │                          │
│    Handling   │    endpoints    │                          │
├───────────────┴──────────────────┴──────────────────────────┤
│                     Controllers Layer                        │
│               (Request handling & validation)                │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                            │
│               (Business logic & AI integration)              │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer (Mongoose)                    │
│         ~50+ Models covering all business domains            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       MongoDB                                │
│              (Primary data store)                            │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Express + MongoDB** | Proven stack for rapid API development with flexible schemas |
| **Modular MVC-ish** | Controllers handle HTTP, services contain business logic, models define data shape |
| **JWT over sessions** | Stateless auth scales better for mobile apps |
| **Socket.IO** | Real-time needs (chat, notifications) without polling |
| **Workspace multi-tenancy** | Data isolation between organizations using a simple `workspaceName` field |

### Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Monolithic structure | Simple deployment but harder to scale individual components |
| Mixed `let`/`const` usage | Inconsistency in code style |
| Console.log for debugging | Works but should use structured logging in production |
| No TypeScript | Faster development velocity but less type safety |
| JavaScript SDK for AI (Gemini/OpenAI) | Quick integration but vendor coupling |

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | ^18 |
| **Express** | Web framework | ^4.21 |
| **MongoDB** | Database | ^8.10 (Mongoose) |
| **Socket.IO** | Real-time communication | ^4.8 |
| **JWT** | Authentication | ^9.0 |
| **Nodemailer** | Email service | ^6.10 |
| **Multer** | File uploads | ^1.4 |
| **Node-Cron** | Scheduled tasks | ^3.0 |
| **Google Gemini** | AI question generation | API |
| **OpenAI** | AI features | ^4.86 |
| **PM2** | Process management | ^6.0 |
| **Mocha/Chai** (via Jest) | Testing | ^29.7 |

---

## 📁 Folder Structure

```
reteamnow-backend/
├── config/              # Configuration files
│   ├── db.js           # Database connection & index management
│   ├── gemini_config.js # Gemini AI configuration
│   └── openaiClient.js  # OpenAI client setup
├── constants/           # Enums & shared constants
│   └── enums.js
├── controllers/         # Route handlers (HTTP layer)
│   ├── authController.js
│   ├── user.controller.js
│   ├── surveyController.js
│   └── ... (65+ controllers)
├── errors/              # Custom error classes
│   ├── custom-api.js
│   ├── bad-request.js
│   ├── not-found.js
│   ├── unauthenticated.js
│   └── unauthorized.js
├── middlewares/         # Express middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── upload.middleware.js
│   └── ... (11+ middlewares)
├── models/              # Mongoose schemas & models
│   ├── user-model.js
│   ├── Company-Model.js
│   └── ... (50+ models)
├── routes/              # Express route definitions
│   ├── authRoutes.js
│   ├── users.route.js
│   └── ... (50+ route files)
├── scripts/             # Utility & migration scripts
│   ├── createSampleEmployees.js
│   ├── fix-attendance-schema.js
│   └── checkEmployees.js
├── service/             # Business logic layer
│   ├── auth.service.js
│   ├── notification.service.js
│   ├── gemini.service.js
│   └── ... (13+ services)
├── utils/               # Shared utilities
│   ├── logger.js
│   ├── authutils.js
│   ├── sendEmail.js
│   └── ... (12+ utilities)
├── uploads/             # Uploaded files directory
├── app.js               # Express application setup
├── index.js             # Server entry point
├── package.json
└── README.md
```

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **PM2** (optional, for production)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/reteamnow-backend.git
cd reteamnow-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables)).

### Step 4: Start MongoDB

Ensure MongoDB is running locally or update `MONGO_URI` in `.env` to point to your MongoDB instance.

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (`dev`, `production`) | No | `dev` |
| `PORT` | Server port | No | `8017` |
| `MONGO_URI` | MongoDB connection string | **Yes** | - |
| `MONGODB_NAME` | MongoDB database name | **Yes** | - |
| `JWT_SECRET` | JWT signing secret | **Yes** | - |
| `JWT_LIFETIME` | JWT token lifetime (days) | No | `90` |
| `CLIENT_URL` | Frontend URL for CORS | **Yes** | - |
| `BACKEND_API_URL` | Public API URL | No | - |
| `GEMINI_API_KEY` | Google Gemini AI key | For AI features | - |
| `OPENAI_API_KEY` | OpenAI API key | For AI features | - |
| `EMAIL_USER` | SMTP username | For email | - |
| `EMAIL_PASS` | SMTP password | For email | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | For S3 | - |
| `AWS_SECRET_KEY_ID` | AWS secret key | For S3 | - |
| `AWS_BUCKET_NAME` | S3 bucket name | For S3 | - |

---

## 🎯 Running Locally

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode (via PM2)

```bash
npm start
```

### Other Commands

```bash
# Stop the server
npm run stop

# View PM2 logs
npm run log

# Create sample employee data
npm run create-sample-employees

# Check employee data
npm run check-employees
```

The API will be available at `http://localhost:8017`.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/password-reset/verify-otp` | Verify OTP |
| POST | `/api/password-reset/resend-otp` | Resend OTP |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/create-user` | Create user |
| GET | `/api/user/get-all-users` | List all users |
| GET | `/api/user/:id` | Get user by ID |
| PUT | `/api/user/:id` | Update user |
| DELETE | `/api/user/:id` | Delete user |
| POST | `/api/user/import` | Bulk import users |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/checkin` | Check in |
| PUT | `/api/attendance/checkout` | Check out |
| GET | `/api/attendance/today/:userId` | Today's status |
| GET | `/api/attendance/history/:userId` | Attendance history |
| GET | `/api/attendance/monthly/:userId` | Monthly analytics |

### Surveys

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/survey/getActiveSurveys` | Get active surveys |
| POST | `/survey/create` | Create survey |
| GET | `/survey/:id` | Get survey details |
| POST | `/survey/:id/submit` | Submit survey response |
| GET | `/survey/:id/analytics` | Survey analytics |

### Events & Competitions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event/competitions` | List competitions |
| GET | `/api/event/competitions/:id` | Competition details |
| POST | `/api/event/create` | Create event |
| POST | `/api/event/competitions/:id/posts` | Create post |

### Comments & Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments` | Create comment |
| GET | `/api/comments/:targetType/:targetId` | Get comments |
| POST | `/api/actions` | Create action |
| GET | `/api/actions` | List actions |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/:userId` | Get user notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notify-users` | Send notification |

*For the complete API reference, see the route files in `/routes/`.*

---

## 📊 Database Schema

The application uses MongoDB with Mongoose ODM. Key collections include:

- **users** - Employee/Admin user accounts
- **workspaces** - Multi-tenant workspace definitions
- **surveys** - Survey configurations and responses
- **events** - Events and competitions
- **attendances** - Daily attendance records
- **notifications** - In-app notifications
- **comments** - Thread comments
- **assets** - Asset inventory
- **companies** - Company profiles

*For complete schema details, see the model files in `/models/`.*

---

### Creating New Routes

1. Create a controller in `/controllers/`
2. Create a route file in `/routes/`
3. Add the route to `/app.js`

---