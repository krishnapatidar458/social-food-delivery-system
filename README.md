# Social Food Delivery System 🍔🚀

A MERN stack project combining **Social Media features** and **Food Delivery** services from **local kitchens**.

---

## 📁 Project Structure

```
social-food-delivery-system/
├── backend/
├── frontend/
├── docker/
├── README.md
├── .gitignore
└── package.json
```

---

## 🚀 How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/social-food-delivery-system.git
cd social-food-delivery-system
```

---

## 🛠 Backend Setup (`/backend`)

### Install Backend Dependencies

```bash
cd backend
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors multer cloudinary morgan express-async-handler nodemailer razorpay
npm install --save-dev nodemon
```

### Environment Variables

Create a `.env` file inside `backend/`:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Start Backend Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 🌐 Frontend Setup (`/frontend`)

### Install Frontend Dependencies

```bash
cd frontend
npm install react-router-dom axios redux react-redux @reduxjs/toolkit
```

### Start Frontend Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📦 Useful Commands

| Task                  | Command                  |
| --------------------- | ------------------------- |
| Start Backend          | `npm run dev` (in /backend) |
| Start Frontend         | `npm run dev` (in /frontend) |
| Production Backend     | `npm start` (in /backend)  |

---

## 🐳 Docker Setup (Optional)

Inside `/docker/` we maintain:

- `docker-compose.yml`
- `backend.Dockerfile`
- `frontend.Dockerfile`

To run:

```bash
docker-compose up --build
```

---

## 📋 .gitignore Important Files

Make sure your `.gitignore` contains:

```
# Node.js
node_modules/
.env

# Logs
logs
*.log

# Vite / React
dist/
.vite/

# Docker
docker-volume/
```

---

## ❤️ Contributing

Pull requests are welcome.  
Let's build the next-generation food delivery + social platform together!

---

## 📧 Contact

- Developer: **Krishna Patidar**
- Email: krishnapatidar4583@gmail.com

---

# 🔥 Happy Coding!
