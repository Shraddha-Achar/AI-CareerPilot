# 🤖 AI CareerPilot

> An AI-powered career assistant that analyzes resumes against job descriptions, identifies skill gaps, improves resumes, and helps users prepare for interviews.

AI CareerPilot is a full-stack AI-powered career platform designed to help job seekers understand how well their resume matches a target role and improve their career readiness.

Users can upload a resume as a PDF, automatically extract its content, provide a target job description, and receive AI-powered career insights, resume improvements, interview preparation, and mock interview practice.

---

## 🌍 Live Demo

🚀 **Live Application:** [Open AI CareerPilot](https://ai-careerpilot-1.onrender.com)

🔗 **Backend API:** [FastAPI API](https://ai-careerp​ilot-wfn7.onrender.com)

📖 **API Documentation:** [Swagger UI](https://ai-careerp​ilot-wfn7.onrender.com/docs)

---

## ✨ Features

### 📄 Resume PDF Upload & Extraction

Upload a PDF resume and automatically extract its text using Python and `pypdf`.

### 🎯 Resume–Job Match Analysis

Compare the candidate's resume with a target job description using Google's Gemini AI.

### 🤖 ATS Score

Evaluate the resume for ATS compatibility and identify areas that can be improved.

### 📊 Job Readiness Analysis

Analyze overall career readiness based on resume, job requirements, and interview performance.

### ✅ Matching Skills

Identify technical skills, qualifications, and experience already matching the target role.

### ⚠️ Skill Gap Detection

Discover important skills mentioned in the job description that are missing or need improvement.

### 💪 Strength Analysis

Identify the candidate's strongest areas based on their resume and target role.

### ✍️ AI Resume Improvement

Generate personalized suggestions to improve resume content, keywords, structure, and job alignment.

### 📚 Personalized Learning Recommendations

Recommend technologies, concepts, and skills to learn based on identified skill gaps.

### 🗺️ Career Roadmap

Provide personalized career focus areas and recommended actions based on the user's career goals and analysis.

### 🎤 Interview Preparation

Generate interview preparation guidance based on the target role and candidate profile.

### 🎙️ AI Mock Interview

Practice interview questions through an AI-powered mock interview experience.

### 📈 Resume Version History

Track different resume versions and monitor changes in career readiness metrics over time.

### 📊 Career Progress Tracking

Track metrics such as ATS score, job match, interview performance, and job readiness across resume versions.

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
* Pydantic
* python-dotenv
* pypdf

### AI

* Google Gemini API
* Prompt Engineering

### Development Tools

* Git
* GitHub
* Visual Studio Code

### Deployment

* Render

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
3. `pypdf` extracts the resume text.
4. User provides a target job description.
5. Resume content and job requirements are sent to Gemini.
6. Gemini analyzes the candidate's profile against the target role.
7. CareerPilot calculates and displays career readiness metrics.
8. Users receive matching skills, skill gaps, strengths, improvements, and learning recommendations.
9. Users can improve their resume using AI-generated suggestions.
10. Users can prepare for interviews and practice using the AI mock interview.
11. Resume versions and progress metrics are stored for future comparison.

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
pip install -r requirements.txt
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

## 📌 Project Roadmap

### Completed

* [x] React + Vite frontend
* [x] FastAPI backend
* [x] Gemini API integration
* [x] Prompt-based career analysis
* [x] Resume–job matching
* [x] ATS score analysis
* [x] Job readiness analysis
* [x] Skill gap analysis
* [x] Learning recommendations
* [x] PDF resume upload
* [x] PDF text extraction
* [x] AI resume improvement
* [x] Interview preparation
* [x] AI mock interview
* [x] Career roadmap
* [x] Career action center
* [x] Resume version history
* [x] Career progress tracking
* [x] Production deployment
* [x] Environment-based API configuration

### Future Improvements

* [ ] User authentication
* [ ] Job recommendation system
* [ ] OCR support for scanned resumes
* [ ] Advanced resume keyword optimization
* [ ] Persistent cloud database
* [ ] Additional AI career analytics
---

## 🎯 Future Vision

AI CareerPilot aims to become an intelligent career companion that helps users throughout their complete job-search journey:

```text
Resume
   ↓
Career Analysis
   ↓
Skill Gap Detection
   ↓
Resume Improvement
   ↓
Career Roadmap
   ↓
Learning Recommendations
   ↓
Interview Preparation
   ↓
Mock Interview
   ↓
Job Recommendations

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
