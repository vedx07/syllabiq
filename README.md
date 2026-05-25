# 🚀 SyllabiQ

AI-powered career intelligence platform that analyzes resumes, identifies skill gaps, suggests career paths, and generates personalized learning roadmaps.

## ✨ Features

- AI Resume Analysis
- Role Fit Assessment
- Skill Gap Detection
- Personalized Learning Roadmaps
- Company Recommendations
- Secure JWT Authentication
- Analysis History Dashboard
- Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Node.js + Express
- MongoDB
- Google Generative AI
- JWT Authentication

---

## 🚀 Setup

### 1. Clone Repo

```bash
git clone https://github.com/yourusername/syllabiq.git
cd syllabiq
```

### 2. Install Dependencies

```bash
npm install

cd server && npm install
cd ../client && npm install
```

### 3. Configure Environment

Create `.env` inside `server/`

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
PORT=5000
```

### 4. Run Project

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run dev
```

---

## 📁 Structure

```bash
client/     # React frontend
server/     # Express backend
```

---

## 📡 Core APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/upload/analyze` | Upload & analyze resume |
| GET | `/api/history` | Fetch analysis history |

---

## 🎯 Future Plans

- LinkedIn Integration
- Salary Insights
- Resume Optimization
- AI Cover Letter Generator
- Mobile App

---

## 🤝 Contributing

```bash
git checkout -b feature-name
git commit -m "feat: add feature"
git push origin feature-name
```

---

## 📄 License

ISC License

---

### Made by Vedant
