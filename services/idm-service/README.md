


# 🧩 IDM Service — Node.js + Prisma + Supabase

An extensible **Identity & Access Management (IAM)** backend built with **Node.js**, **Express**, **Prisma ORM**, and **Supabase (PostgreSQL)**.  
Includes full modular support for:
- Users
- Credentials (Password / External / MFA)
- Sessions & Tokens
- Organizations
- Subscriptions
- User Information (profile)
- Multi-Factor Authentication (MFA)

---

## 📁 Project Structure
```
idm-service/
│
├── prisma/                     # Prisma ORM schema & migrations
│   └── schema.prisma
│
├── src/
│   ├── app.js                  # Express app setup
│   ├── index.js                # Entry point
│   ├── routes.js               # REST API routes
│   │
│   ├── common/                 # Common utilities
│   │   ├── errors.js           # AppError class & assert helper
│   │   └── utils.js
│   │
│   ├── db/
│   │   └── prisma.js           # PrismaClient connection
│   │
│   ├── middleware/             # Middlewares
│   │   ├── auth.js             # JWT verification middleware
│   │   └── logger.js           # Request + DB logging middleware
│   │
│   ├── dto/                    # Zod validation schemas
│   │   ├── user.dto.js
│   │   ├── credential.dto.js
│   │   ├── mfa.dto.js
│   │   ├── session.dto.js
│   │   ├── subscription.dto.js
│   │   ├── organization.dto.js
│   │   └── userInfo.dto.js
│   │
│   ├── services/               # Business logic layer
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── organization.service.js
│   │   ├── subscription.service.js
│   │   └── userInfo.service.js
│   │
│   ├── controllers/            # REST API controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── organization.controller.js
│   │   ├── subscription.controller.js
│   │   └── userInfo.controller.js
│   │
│   └── ...
│
├── .env                        # Environment variables (local)
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

| Component | Technology |
|------------|-------------|
| Runtime | Node.js 20+ |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (access & refresh tokens) |
| Validation | Zod |
| Logging | Pino + Prisma-based DB logger |
| MFA | TOTP (Speakeasy) |

---

## 🧑‍💻 Setup & Installation

### 1️⃣ Clone & install dependencies
```bash
git clone https://github.com/<your-org>/idm-service.git
cd idm-service
npm install
````

### 2️⃣ Configure environment variables

Create `.env` in the project root:

```env
# Supabase (recommended)
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require"

# Optional: if you use local Postgres
# DATABASE_URL="postgresql://idm:idm@localhost:5432/idm?schema=public"

# Optional: shadow DB for Prisma migrate dev
# SHADOW_DATABASE_URL="postgresql://idm:idm@localhost:5432/idm_shadow"

JWT_SECRET=dev-secret-change-me
ACCESS_TOKEN_TTL_MIN=30
REFRESH_TOKEN_TTL_DAYS=14
PORT=3000
NODE_ENV=development
```

### 3️⃣ Setup database schema

#### If using Supabase (hosted Postgres)

```bash
npx prisma db push
```

#### If using local Postgres (Docker)

```bash
docker compose up -d
npx prisma migrate dev --name init
```

### 4️⃣ Run the service

```bash
npm run dev
# or
npm start
```

Visit: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧱 Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(uuid())
  status        String   @default("active")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  email         String   @unique
  phone         String
  firstName     String
  lastName      String
  lastLoginAt   DateTime?
  loginFailures Int      @default(0)
  lockUntil     DateTime?
  credentials   Credential[]
  sessions      Session[]
  subscriptions Subscription[]
  info          UserInformation?
  mfaDevices    MFADevice[]
}

model Credential {
  id           String   @id @default(uuid())
  userId       String
  type         String
  passwordHash String?
  externalId   String?
  revokedAt    DateTime?
  status       String   @default("active")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model Session {
  id          String   @id @default(uuid())
  userId      String
  status      String   @default("active")
  ip          String?
  userAgent   String?
  expiresAt   DateTime
  mfaVerified Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}

model Organization {
  id           String   @id @default(uuid())
  name         String
  domain       String?
  address      String?
  country      String?
  industry     String?
  contactEmail String?
  contactPhone String?
  size         Int?
  status       String   @default("active")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  subscriptions Subscription[]
}

model Subscription {
  id        String   @id @default(uuid())
  userId    String
  orgId     String?
  type      String
  userType  String
  status    String   @default("active")
  startDate DateTime
  endDate   DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User         @relation(fields: [userId], references: [id])
  org       Organization? @relation(fields: [orgId], references: [id])
}

model MFADevice {
  id        String   @id @default(uuid())
  userId    String
  type      String
  secret    String
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model UserInformation {
  id              String   @id @default(uuid())
  userId          String   @unique
  dateOfBirth     String?
  gender          String?
  address         String?
  city            String?
  country         String?
  postalCode      String?
  profileImageUrl String?
  language        String?
  timezone        String?
  preferences     Json?
  status          String   @default("active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id])
}

model LogEntry {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  level     String
  method    String?
  path      String?
  status    Int?
  userId    String?
  ip        String?
  userAgent String?
  message   String?
  meta      Json?
}
```

---

## 🔐 Authentication & Tokens

| Type          | Description                       |
| ------------- | --------------------------------- |
| Access Token  | Short-lived JWT (default: 30 min) |
| Refresh Token | Long-lived JWT (default: 14 days) |
| MFA           | TOTP (via Speakeasy)              |
| Passwords     | Hashed with bcrypt                |

---

## 🚀 API Overview

### **Auth Routes**

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/api/auth/register`      | Register a new user      |
| POST   | `/api/auth/login`         | Login and receive tokens |
| POST   | `/api/auth/token/refresh` | Refresh access token     |
| POST   | `/api/auth/token/revoke`  | Revoke a token           |
| POST   | `/api/auth/mfa/register`  | Register MFA device      |
| POST   | `/api/auth/mfa/verify`    | Verify MFA code          |

### **User Routes**

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/users`                       | Get all users          |
| GET    | `/api/users/:userId`               | Get a specific user    |
| PATCH  | `/api/users/:userId`               | Update user info       |
| POST   | `/api/users/:userId/lock`          | Lock account           |
| POST   | `/api/users/:userId/unlock`        | Unlock account         |
| GET    | `/api/users/:userId/active`        | Check if active        |
| GET    | `/api/users/:userId/fullname`      | Get full name          |
| GET    | `/api/users/:userId/trial-expired` | Check trial expiration |

### **Organization Routes**

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/organizations`        | Create organization   |
| GET    | `/api/organizations`        | Get all organizations |
| GET    | `/api/organizations/:orgId` | Get one               |
| PATCH  | `/api/organizations/:orgId` | Update                |
| DELETE | `/api/organizations/:orgId` | Delete                |

### **Subscription Routes**

| Method | Endpoint                                     | Description         |
| ------ | -------------------------------------------- | ------------------- |
| POST   | `/api/subscriptions`                         | Create subscription |
| GET    | `/api/subscriptions`                         | List all            |
| GET    | `/api/subscriptions/:id`                     | Get one             |
| PATCH  | `/api/subscriptions/:id`                     | Update              |
| DELETE | `/api/subscriptions/:id`                     | Delete              |
| GET    | `/api/subscriptions/user/:userId/has-active` | Check active subs   |

### **User Information Routes**

| Method | Endpoint                           | Description               |
| ------ | ---------------------------------- | ------------------------- |
| PUT    | `/api/users/:userId/info`          | Upsert user info          |
| GET    | `/api/users/:userId/info`          | Get info                  |
| DELETE | `/api/users/:userId/info`          | Delete                    |
| GET    | `/api/users/:userId/info/complete` | Check if profile complete |

---

## 🧪 Example API Usage

**Register**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com","phone":"0541234567","firstName":"Jane","lastName":"Doe","password":"StrongPass123!"}'
```

**Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com","password":"StrongPass123!"}'
```

**Protected route (get users)**

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 🧰 Development Commands

| Command                     | Description                   |
| --------------------------- | ----------------------------- |
| `npm run dev`               | Run server with nodemon       |
| `npm start`                 | Run in production mode        |
| `npx prisma studio`         | Web-based DB GUI              |
| `npx prisma db push`        | Sync schema (no migrations)   |
| `npx prisma migrate dev`    | Apply migration               |
| `npx prisma migrate deploy` | Deploy migrations (Supabase)  |
| `docker compose up -d`      | Run local Postgres (optional) |

---

## 🪵 Logging

* **Console**: via Pino (pretty print)
* **Database**: via `LogEntry` model
  (every request stored asynchronously with metadata)

---

## 🧠 Design Notes

* **Layered architecture**: DTO → Service → Controller
* **Schema validation**: enforced via Zod
* **Async Prisma calls**: service layer handles persistence
* **JWT middleware**: secures all routes except `/auth/*`
* **Supabase ready**: uses SSL and direct connection
* **MFA support**: built-in TOTP (Speakeasy)

---

## 📦 Deployment (Supabase)

1. Provision Supabase project.
2. Copy connection string to `.env` → `DATABASE_URL`.
3. Run migrations:

   ```bash
   npx prisma migrate deploy
   ```
4. Deploy the Node.js app (Render / Vercel / AWS / etc.)
5. Verify connection and `/health` endpoint.

---
