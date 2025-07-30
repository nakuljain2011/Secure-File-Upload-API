# Secure File Upload API

This project provides a secure RESTful API built with Node.js and Express.js for uploading and downloading files. It incorporates modern security practices including JWT for authentication, AES-256 encryption for files at rest, and detailed audit logging for all file-related actions.

## Features

-   **Secure Endpoints**: All file operations are protected and require a valid JSON Web Token (JWT).
-   **File Encryption**: Files are encrypted on the server using AES-256-CBC, ensuring they are unreadable even with direct server access.
-   **Token-Based Access**: A temporary token is generated for users to access the protected routes.
-   **Audit Logging**: Every upload and download action is logged with user details, filename, and status, providing a clear audit trail.
-   **Modular Structure**: The code is organized for clarity and future expansion.

## Project Structure

/├── files/              # Stores the encrypted files├── logs/               # Contains the audit log file│   └── audit.log├── node_modules/       # Project dependencies├── index.js            # Main server and application logic├── package.json        # Project metadata and dependencies└── package-lock.json   # Exact dependency versions
## Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/en/) (v14.x or newer)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A REST client like [Postman](https://www.postman.com/downloads/) or [Thunder Client](https://www.thunderclient.com/) (for VS Code) to test the API.

## Installation & Setup

Follow these steps to get the project up and running on your local machine.

**Step 1: Clone the Repository (or Set Up Files)**

If this were a Git repository, you would clone it. For this setup, create a project folder and place the `index.js` and `package.json` files inside it.

**Step 2: Install Dependencies**

Navigate to the root of your project directory in your terminal and run the following command to install all the required packages:

```bash
npm install
Step 3: Start the ServerOnce the dependencies are installed, you can start the server with:npm start
You should see the following message in your console, indicating that the server is running correctly:Server is running on http://localhost:3000
How to Use the APIHere is a guide to interacting with the API endpoints.1. Get an Authentication TokenFirst, you need to get a JWT to access the secure endpoints.Endpoint: POST /loginMethod: POSTBody: NoneResponse:{
    "token": "your-generated-jwt-token"
}
Copy this token for the next steps.2. Upload a FileTo upload a file, you need to send a multipart/form-data request.Endpoint: POST /uploadMethod: POSTHeaders:Authorization: Bearer <your-jwt-token>Body (form-data):Key: fileValue: Select a file from your computer.Success Response:Code: 200 OKBody: File uploaded and encrypted successfully.3. Download a FileTo download a previously uploaded file.Endpoint: GET /download/:filenameMethod: GETExample URL: http://localhost:3000/download/my-document.txtHeaders:Authorization: Bearer <your-jwt-token>Success Response:Code: 200 OKBody: The raw, decrypted file data. Your REST client will allow you to save this response as a file.Error Response (if file not found):Code: 404 Not FoundBody: File not found.Security ConsiderationsJWT Secret: The JWT_SECRET in index.js is a placeholder. In a production environment, this should be replaced with a long, complex, and randomly generated string stored securely as an environment variable.Encryption Key: The ENCRYPTION_KEY is generated randomly every time the server starts. This means all uploaded files will become undecipherable if the server restarts. For a persistent application, you must generate a single, static key and store it securely as an environment variable, similar to the JWT secret.LoggingAll significant actions are logged to logs/audit.log. This file contains JSON objects for each event, providing a reliable record of API usage.Example Log Entry:{"action":"upload","user":"testuser","file":"example.txt","status":"success","level":"info","message":""}
{"action":"download","user":"testuser","file":"example.txt","status":"success","level":"info","message":""}
