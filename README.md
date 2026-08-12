# 🤖 AI CareerPilot

> An AI-powered career assistant that analyzes resumes against job descriptions, identifies skill gaps, and provides personalized career recommendations.

AI CareerPilot is a full-stack AI application designed to help job seekers understand how well their resume matches a target role and identify the skills they should improve.

Users can upload their resume as a PDF, automatically extract the resume content, provide a target job description, and receive AI-powered career insights.

---

## ✨ Features

### 📄 Resume PDF Upload

Upload a PDF resume and automatically extract its text using Python.

### 🎯 Resume–Job Match Analysis

Compare the candidate's resume with a target job description using Google's Gemini AI.

### 📊 AI Match Score

Get an AI-generated percentage indicating how closely the resume matches the target role.

### ✅ Matching Skills

Identify technical skills and qualifications already present in the resume.

### ⚠️ Skill Gap Detection

Discover important skills mentioned in the job description that are missing from the resume.

### 💪 Strength Analysis

Understand the candidate's strongest areas based on their resume.

### 📈 Improvement Suggestions

Receive actionable recommendations for improving skills and resume content.

### 📚 Personalized Learning Recommendations

Get suggestions for technologies, concepts, and skills to learn based on identified gaps.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* FastAPI
* Uvicorn
* pypdf

### AI

* Google Gemini API
* Prompt Engineering

### Development Tools

* Git
* GitHub
* Visual Studio Code

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │                      │
                    │  Resume PDF          │
                    │  Job Description     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │    Frontend          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     pypdf       │        │   Gemini API    │
        │                 │        │                 │
        │ Extract Resume  │        │ AI Career       │
        │ Text            │        │ Analysis        │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌──────────────────────┐
                    │   Career Analysis    │
                    │                      │
                    │ Match Score           │
                    │ Matching Skills       │
                    │ Skill Gaps            │
                    │ Strengths             │
                    │ Improvements          │
                    │ Learning              │
                    └──────────────────────┘
```

---

## 🔄 How It Works

1. User uploads their resume in PDF format.
2. FastAPI receives the uploaded file.
3. `pypdf` extracts the text from the resume.
4. User provides a target job description.
5. Resume content and job requirements are sent to Gemini.
6. Gemini analyzes the candidate's profile against the job.
7. The backend returns structured career analysis.
8. React displays the results in an interactive dashboard.

---

## 📊 AI Analysis Output

CareerPilot provides:

| Analysis          | Description                         |
| ----------------- | ----------------------------------- |
| 🎯 Match Score    | Overall resume-to-job compatibility |
| ✅ Matching Skills | Skills already matching the role    |
| ⚠️ Skill Gaps     | Important missing skills            |
| 💪 Strengths      | Candidate's strongest areas         |
| 📈 Improvements   | Suggestions for improvement         |
| 📚 Learning       | Recommended skills and technologies |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Python 3.10+
* Node.js
* npm
* Git
* Google Gemini API key

---

## 📥 Clone the Repository

```bash
git clone https://github.com/Shraddha-Achar/AI-CareerPilot.git
```

```bash
cd AI-CareerPilot
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install fastapi uvicorn python-dotenv google-genai pypdf python-multipart
```

---

## 🔐 Configure Gemini API

Create a `.env` file inside:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
```

⚠️ Never commit your API key to GitHub.

---

## ▶️ Run the Backend

From the `backend` directory:

```powershell
python -m uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

or:

```text
http://localhost:5174
```

---

# 🔐 Security

The following files are intentionally excluded from Git:

```text
.env
venv/
node_modules/
dist/
```

Never expose your Gemini API key publicly.

---

# 📌 Project Roadmap

### Completed

* [x] React + Vite frontend
* [x] FastAPI backend
* [x] Gemini API integration
* [x] Prompt-based career analysis
* [x] Resume–job matching
* [x] Match score
* [x] Skill gap analysis
* [x] Learning recommendations
* [x] PDF resume upload
* [x] PDF text extraction
* [x] GitHub integration

### Upcoming

* [ ] AI-powered resume improvement
* [ ] Resume keyword optimization
* [ ] AI interview question generator
* [ ] Personalized career roadmap
* [ ] Job recommendation system
* [ ] Resume scoring improvements
* [ ] OCR support for scanned resumes
* [ ] User authentication
* [ ] Deployment to cloud

---

## 🎯 Future Vision

AI CareerPilot aims to become an intelligent career companion that helps users:

```text
Resume
   ↓
Career Analysis
   ↓
Skill Gap Detection
   ↓
Resume Improvement
   ↓
Learning Roadmap
   ↓
Interview Preparation
   ↓
Job Recommendations
```

---

## 👩‍💻 Author

**Shraddha Achar**

Computer Science Graduate | Software Development | AI | Full-Stack Development

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for educational and portfolio purposes.
