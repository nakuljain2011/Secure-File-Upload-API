const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// --- Configuration ---
const JWT_SECRET = 'your-super-secret-key'; // Replace with a strong, secret key
const UPLOAD_DIR = path.join(__dirname, 'files');
const LOG_DIR = path.join(__dirname, 'logs');

// --- Create directories if they don't exist ---
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// --- Logger Setup ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(LOG_DIR, 'audit.log') }),
  ],
});

// --- Multer Setup for file uploads ---
const upload = multer({ dest: UPLOAD_DIR });

// --- Middleware for JWT authentication ---
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// --- Encryption and Decryption ---
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

// --- Routes ---
app.post('/upload', authenticateJWT, upload.single('file'), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileBuffer = fs.readFileSync(file.path);
  const encryptedFile = encrypt(fileBuffer);
  
  const newFilePath = path.join(UPLOAD_DIR, file.originalname + '.enc');
  fs.writeFileSync(newFilePath, encryptedFile);
  fs.unlinkSync(file.path); // Clean up the original multer upload

  logger.info({
    action: 'upload',
    user: req.user.username,
    file: file.originalname,
    status: 'success',
  });

  res.send('File uploaded and encrypted successfully.');
});

app.get('/download/:filename', authenticateJWT, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename + '.enc');

  if (fs.existsSync(filePath)) {
    const encryptedFile = fs.readFileSync(filePath, 'utf8');
    const decryptedFile = decrypt(encryptedFile);

    logger.info({
      action: 'download',
      user: req.user.username,
      file: filename,
      status: 'success',
    });

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(decryptedFile);
  } else {
    logger.error({
      action: 'download',
      user: req.user.username,
      file: filename,
      status: 'not_found',
    });
    res.status(404).send('File not found.');
  }
});

// --- Token Generation (for testing) ---
app.post('/login', (req, res) => {
  // In a real app, you'd validate user credentials here
  const username = 'testuser';
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
