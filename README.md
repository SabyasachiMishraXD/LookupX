# LookupX

# 📞 Phonebook Backend API - Spam Detection & Search System

This is a Node.js backend project that simulates a contact management and spam reporting system.  
It supports user registration, login, importing contacts, spam detection, and global contact search.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **Prisma ORM** with MySQL
- **JWT Authentication**
- **Zod** for input validation
- **bcryptjs** for password hashing
- **dotenv** for environment configuration

---

## 📁 Project Structure

```
CODING TASK/
├── prisma/                 # Prisma schema & migration files
├── scripts/                # Script to generate test data
├── src/
│   ├── config/             # JWT configuration
│   ├── controllers/        # Logic for routes (auth, contact, spam, search)
│   ├── middlewares/        # JWT authentication middleware
│   ├── routes/             # All route declarations
│   ├── utils/              # Reusable utility logic
│   ├── validators/         # Zod validation schemas
│   ├── app.js              # Express app config
│   └── index.js            # Main server file
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 Setup Instructions

1. **Unzip the folder** you received (`coding-task-submission.zip`) into any local directory.

2. **Navigate into the project folder**:
   ```bash
   cd CODING-TASK
   ```

3. **Install all dependencies** using:
   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root of the project using the following template:
   ```env
   PORT=5000
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=7d
   DATABASE_URL=mysql://<your_mysql_username>:<your_password>@localhost:3306/<your_database_name>
   ```

5. **Run Prisma migrations to set up the database**:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **(Optional) Generate sample data** for testing:
   ```bash
   node scripts/generateTestData.js
   ```

7. **Start the server**:
   ```bash
   npm run dev
   ```

8. The server should run at:
   ```
   http://localhost:5000
   ```

---

## 📨 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| POST   | `/api/auth/register`       | Register a new user           |
| POST   | `/api/auth/login`          | Login and receive JWT         |
| POST   | `/api/auth/forgot-password`| Request OTP for password reset|
| POST   | `/api/auth/reset-password` | Reset password using OTP      |
| GET    | `/api/auth/me`             | Get logged-in user profile    |

---

### 👥 Contact Routes

| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | `/api/contacts/import`  | Import phone contacts |

---

### 🚨 Spam Routes

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| POST   | `/api/spam/report`   | Mark number as spam     |

---

### 🔍 Search Routes

| Method | Endpoint                             | Description                          |
|--------|--------------------------------------|--------------------------------------|
| GET    | `/api/search?name=<query>`           | Search users & contacts by name      |
| GET    | `/api/search/phone?phone=<number>`   | Search by phone number               |
| GET    | `/api/search/user/:phone/details`    | Get full profile with spam count     |

> All search routes require JWT token in headers:
```
Authorization: Bearer <your_token>
```

---

## 🧪 Test Data Generated

- 20 Users with unique phone numbers
- 30 Contacts per user
- 10 Random spam reports

All names are stored in lowercase to enable case-insensitive search.

---

## 👤 Author

**Sabyasachi Mishra**  

---

