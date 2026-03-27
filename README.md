# ⚖️ VakilAI

**AI-powered legal document simplifier — in plain English & Hindi**

> 🏆 Built for **Hacktoon 1.0** · Neuronyx Club, AIKTC

---

## 🧠 What is VakilAI?

VakilAI is an AI-powered legal document simplifier that helps everyday Indians understand complex legal documents — without needing a lawyer. Upload any legal PDF (rental agreement, NDA, employment contract), and VakilAI instantly breaks it down into plain language, flags risky clauses, and even reads it out loud to you.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 📄 **PDF Upload** | Upload any legal document in PDF format |
| 🤖 **AI Summary** | LLaMA 3 (via Groq) generates plain English/Hindi summaries |
| 🚨 **Risk Flags** | Automatically detects and highlights dangerous clauses |
| 🎯 **RiskMeter** | Visual danger-level indicator for the entire document |
| 🃏 **ClauseCards** | Clause-by-clause breakdown in simple language |
| 🔊 **Voice Explanation** | Web Speech API reads out summaries aloud |
| 📁 **Document History** | All past documents saved per user account |
| 🔐 **Secure Auth** | JWT-based login & registration |

---

## 🏗️ Tech Stack
```
   FRONTEND
   React.js · PDF.js
   Web Speech API · Axios
        |
      REST API
        |
   BACKEND
   Node.js · Express
   JWT · bcrypt · Multer
        |
   _____|_____
   |         |
Groq API   MongoDB
LLaMA 3    Users·Docs
```

---

## 📁 Project Structure
```
VakilAI/
├── backend/
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── groq.js
│   ├── controllers/
│   │   ├── analysisController.js
│   │   ├── authController.js
│   │   └── documentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Document.js
│   │   └── User.js
│   └── routes/
│       ├── analysisRoutes.js
│       ├── authRoutes.js
│       └── documentRoutes.js
│
└── frontend/src/
    ├── App.js
    ├── components/
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── UploadPage.js
    │   │   ├── AnalysisPage.js
    │   │   ├── DocumentsPage.js
    │   │   ├── LoginPage.js
    │   │   └── RegisterPage.js
    │   ├── common/
    │   │   ├── ClauseCard.js
    │   │   ├── RiskMeter.js
    │   │   └── VoiceButton.js
    │   └── layout/
    │       └── Navbar.js
    ├── context/
    │   └── AuthContext.js
    ├── hooks/
    │   └── useVoice.js
    └── services/
        ├── api.js
        └── documentService.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key → [console.groq.com](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/Solkar-Mubashshir/VakilAi.git
cd VakilAi
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

App runs at → `http://localhost:3000`

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GROQ_API_KEY` | Groq API key for LLaMA 3 access |

---

## 🔄 How It Works
```
User uploads PDF
      ↓
PDF.js extracts text (frontend)
      ↓
Sent to Node.js backend via REST API
      ↓
Backend calls Groq API (LLaMA 3)
      ↓
AI returns:
  • Plain English / Hindi summary
  • Risk flags per clause
      ↓
Frontend displays:
  • RiskMeter (overall danger level)
  • ClauseCards (per-clause breakdown)
  • Voice explanation (Web Speech API)
      ↓
Saved to MongoDB under user account
```

---

## 🛡️ Security

- Passwords hashed using **bcrypt**
- Routes protected with **JWT middleware**
- File uploads handled securely via **Multer**
- Each user can only access their own documents

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | Get all documents for user |
| DELETE | `/api/documents/:id` | Delete a document |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis` | Analyze uploaded PDF text |

---

## 📄 License

This project is built for educational and hackathon purposes.

---

> *"Because everyone deserves to understand what they sign."*
>
> Built with ❤️ for **Hacktoon 1.0** · Neuronyx Club · AIKTC
