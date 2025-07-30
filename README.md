# 🔐 Secure File Upload API

A secure RESTful API built with **Node.js** and **Express.js** that supports encrypted file uploads and downloads using **AES-256-CBC**. All routes are protected with **JWT authentication**, and actions are logged for auditability.

---

## 🚀 Features

- 🔒 JWT-protected endpoints
- 🗄️ AES-256 encryption for files at rest
- 📥 File upload & 📤 download with token access
- 📜 Audit logging of every action
- 🧩 Modular & extensible codebase

---

## 📁 Project Structure

/secure-file-upload-api
├── files/ # Encrypted files
├── logs/audit.log # JSON-formatted audit logs
├── index.js # Main server file
├── package.json # Project config

---
## ⚙️ Requirements

- Node.js v14+
- npm
- REST client (e.g. Postman / Thunder Client)

---

## 📦 Setup & Run

1. **Install Dependencies**  
 
   npm install

2. **Start Server**

  npm start
  
Server runs at: http://localhost:3000

---

🧪 API Usage

1️⃣ Get JWT Token

POST /login

Response:
{ "token": "your-jwt-token" }

2️⃣ Upload File

POST /upload
Headers: Authorization: Bearer <token>
Body: form-data with key file

3️⃣ Download File

GET /download/:filename
Headers: Authorization: Bearer <token>

---
🔐 Security Notes

Set a strong JWT_SECRET in production via environment variable.
To persist file access across restarts, store a static ENCRYPTION_KEY securely (e.g., .env).
All actions are logged in logs/audit.log.




