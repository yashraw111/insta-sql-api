# 📌 Social Media Backend API

This is a **Node.js + Express** backend for a social media application.  
It supports **user authentication, post feeds, media uploads, likes, comments, and user location features**.  
Authentication is handled using **JWT**, and file uploads are managed via **Multer**.

---

## 🚀 Features

- **User Authentication**
  - Register new users
  - Login with JWT authentication

- **Post Feed**
  - Create a post
  - View all user posts
  - Publish or unpublish a post
  - Get a single post by ID
  - Delete a post

- **Media Management**
  - Upload media files (images/videos)
  - Upload thumbnails
  - Delete media

- **Likes**
  - Like/Unlike posts

- **Comments**
  - Add comments to posts
  - Get comments by post ID
  - Delete comments
  - Get comment count for a post

- **User Location**
  - Get user’s registered location
  - Find nearby users (live)

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MySQL / PostgreSQL** (or any SQL database)
- **JWT (JSON Web Token)** for authentication
- **Multer** for file uploads
- **dotenv** for environment variables

---

## 📂 Project Structure


├── controllers/
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── post.feed.master.controller.js
│ ├── post.feed.media.controller.js
│ ├── post.like.controller.js
│ └── post.comment.controller.js
│
├── middleware/
│ ├── TokenVerify.js
│ └── upload.js
│
├── routes/
│ ├── auth.route.js
│ ├── user.route.js
│ ├── post.feed.master.route.js
│ ├── post.feed.media.route.js
│ ├── post.like.route.js
│ └── post.comment.route.js
│
├── app.js
├── package.json
└── README.md

Install dependencies
-npm install

Create .env file

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=social_media
JWT_SECRET=your_jwt_secret


Run the server

-npm start

🧑‍💻 Author
Developed by Yash Pancha


