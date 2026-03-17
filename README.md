# 🚀 AI Resume Analyzer & Resume Builder (SaaS)

A full-stack **AI-powered Resume Analyzer + Resume Builder SaaS platform** built using modern technologies. This project allows users to create professional resumes, analyze them using AI, and get ATS scores with actionable insights.

---

# 🌐 Live Features

✨ Build Resume from scratch
✨ AI Resume Analysis (ATS Score, Strengths, Weaknesses)
✨ PDF Export
✨ Real-time Preview
✨ Authentication System (JWT आधारित)
✨ Subscription System (Free / Weekly / Monthly / Yearly)
✨ Razorpay Payment Integration
✨ Usage Limiting (Free vs Pro logic)
✨ Dashboard Analytics (Advanced Level)

---

# 🏗️ Tech Stack

## 🔹 Frontend

* React.js
* Tailwind CSS
* Framer Motion
* ShadCN UI

## 🔹 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Bcrypt (Password Hashing)
* Multer (File Upload)
* Cloudinary (File Storage)

## 🔹 AI Integration

* OpenAI API / GPT-based analysis

## 🔹 Payments

* Razorpay

## 🔹 Deployment

* Render (Backend)
* MongoDB Atlas

---

# 📁 Project Structure

```
project-root/
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Backend Development Roadmap (Level System)

## 🟢 LEVEL 0 – Setup

* Project initialization
* Folder structure
* MongoDB connection
* Basic server setup

## 🟢 LEVEL 1 – Architecture

* Clean Express setup
* Middleware structure
* Global error handler
* Response formatting

## 🟢 LEVEL 2 – Authentication

* User model
* Register/Login API
* JWT आधारित auth
* Protected routes
* Role-based access

## 🟢 LEVEL 3 – Resume Upload

* Multer setup
* Resume upload API
* Cloud storage integration
* DB linking with user

## 🟢 LEVEL 4 – SaaS Logic

* Free plan (3 uploads limit)
* Usage tracking system
* Upgrade logic

## 🟢 LEVEL 5 – AI Engine

* Resume analysis system
* GPT integration
* Structured output
* Result storage

## 🟢 LEVEL 6 – Payments

* Razorpay integration
* Order creation
* Payment verification
* Subscription update

## 🟢 LEVEL 7 – Production

* Security (Helmet, CORS)
* Rate limiting
* Deployment setup

## 🟢 LEVEL 8 – Advanced Features

* Score trend graph API
* Dashboard analytics
* Email notification system

---

# 🔐 Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
OPENAI_API_KEY=xxx
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

## 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

## 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 🔌 API Overview

## Auth APIs

* POST `/api/auth/register`
* POST `/api/auth/login`

## Resume APIs

* POST `/api/resume/upload`
* GET `/api/resume/:id`

## AI APIs

* POST `/api/analyze`

## Payment APIs

* POST `/api/payment/create-order`
* POST `/api/payment/verify`

---

# 💡 Key Features Explained

### 🧠 AI Resume Analysis

* ATS score generation
* Keyword analysis
* Suggestions for improvement

### 📄 Resume Builder

* Section-wise editing
* Live preview
* PDF export

### 💳 Subscription System

* Free plan (limited usage)
* Paid plans (unlimited features)

---

# 🛡️ Security Features

* JWT Authentication
* Password hashing
* Rate limiting
* Secure headers (Helmet)
* CORS protection

---

# 📊 Future Improvements

* AI Interview Prep
* Resume Templates Marketplace
* Multi-language support
* Team/Organization dashboard

---

# 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Yash Saini**
Full Stack Developer 🚀

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
