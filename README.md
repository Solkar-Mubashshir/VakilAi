# ⚖️ VakilAI — Legal Document Simplifier for India

Making legal documents accessible to every Indian, in plain English and Hindi.

Built for Hacktoon 1.0
Organized by Neuronyx Club, AIKTC


## 🧠 What is VakilAI?

VakilAI is an AI-powered legal document simplifier that helps everyday Indians understand complex legal documents — without needing a lawyer. Upload any legal PDF (rental agreement, NDA, employment contract), and VakilAI instantly breaks it down into plain language, flags risky clauses, and even reads it out loud to you.


## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 📄 PDF Upload | Upload any legal document in PDF format |
| 🤖 AI Summary | LLaMA 3 (via Groq) generates plain English/Hindi summaries |
| 🚨 Risk Flags | Automatically detects and highlights dangerous clauses |
| 🎯 RiskMeter | Visual danger-level indicator for the entire document |
| 🃏 ClauseCards | Clause-by-clause breakdown in simple language |
| 🔊 Voice Explanation | Web Speech API reads out summaries aloud |
| 📁 Document History | All past documents saved per user account |
| 🔐 Secure Auth | JWT-based login & registration |


## 🏗️ Tech Stack


┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│   React.js · Web Speech API · PDF.js               │
│   Context API (AuthContext) · Axios                │
└────────────────────┬────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────┐
│                    BACKEND                          │
│   Node.js · Express.js · Multer (file upload)      │
│   JWT Authentication · bcrypt                      │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐    ┌──────────▼──────────┐
│   Groq API     │    │      MongoDB         │
│  (LLaMA 3)     │    │  Users · Documents  │
└────────────────┘    └─────────────────────┘


## 📁 Project Structure

VakilAI/
├── backend/
│   ├── server.js                        # Main Express server
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   │   └── groq.js                      # Groq API setup
│   ├── controllers/
│   │   ├── analysisController.js        # AI analysis logic
│   │   ├── authController.js            # Login / Register
│   │   └── documentController.js       # Document CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT protection
│   │   └── uploadMiddleware.js          # Multer file upload
│   ├── models/
│   │   ├── Document.js                  # Document schema
│   │   └── User.js                      # User schema
│   └── routes/
│       ├── analysisRoutes.js
│       ├── authRoutes.js
│       └── documentRoutes.js
│
└── frontend/
    └── src/
        ├── App.js                        # Main app + routing
        ├── components/
        │   ├── pages/
        │   │   ├── HomePage.js
        │   │   ├── UploadPage.js
        │   │   ├── AnalysisPage.js
        │   │   ├── DocumentsPage.js
        │   │   ├── LoginPage.js
        │   │   └── RegisterPage.js
        │   ├── common/
        │   │   ├── ClauseCard.js         # Clause breakdown UI
        │   │   ├── RiskMeter.js          # Visual risk indicator
        │   │   └── VoiceButton.js        # TTS trigger button
        │   └── layout/
        │       └── Navbar.js
        ├── context/
        │   └── AuthContext.js            # Global auth state
        ├── hooks/
        │   └── useVoice.js               # Web Speech API hook
        └── services/
            ├── api.js                    # Axios base config
            └── documentService.js       # Document API calls


## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key → [console.groq.com](https://console.groq.com)


### 1. Clone the Repository

git clone https://github.com/Solkar-Mubashshir/VakilAi.git
cd VakilAi

### 2. Backend Setup

cd backend
npm install

Create a `.env` file in the `backend/` folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key

Start the backend server:


npm run dev


### 3. Frontend Setup


cd ../frontend
npm install
npm start


The app will run at `http://localhost:3000`


## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GROQ_API_KEY` | Groq API key for LLaMA 3 access |


## 🔄 How It Works


User uploads PDF
      ↓
PDF.js extracts text (frontend)
      ↓
Text sent to Node.js backend via REST API
      ↓
Backend sends text to Groq API (LLaMA 3)
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
Document saved to MongoDB under user account


## 🛡️ Security

- Passwords hashed using **bcrypt**
- Routes protected with **JWT middleware**
- File uploads handled securely via **Multer**
- Each user can only access their own documents


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


## 📄 License

This project is built for educational and hackathon purposes.


"VakilAI — Because everyone deserves to understand what they sign."