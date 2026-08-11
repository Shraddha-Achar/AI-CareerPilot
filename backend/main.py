import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai


# Load environment variables
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from .env")

# Create Gemini client
client = genai.Client(api_key=api_key)


# Create FastAPI application
app = FastAPI(title="AI CareerPilot API")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request structure
class CareerAnalysisRequest(BaseModel):
    resume: str
    job_description: str


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "AI CareerPilot Backend is running!"
    }


# Health check
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI CareerPilot API"
    }


# AI Career Analysis endpoint
@app.post("/api/analyze-career")
def analyze_career(request: CareerAnalysisRequest):

    prompt = f"""
You are an expert AI career advisor, resume analyst, and technical recruiter.

Analyze the candidate's resume against the target job description.

RESUME:
{request.resume}

JOB DESCRIPTION:
{request.job_description}

Return ONLY valid JSON.

Do not use Markdown.
Do not use ```json.
Do not add explanations outside the JSON.

Use exactly this structure:

{{
    "match_score": 0,
    "matching_skills": [],
    "missing_skills": [],
    "strengths": [],
    "improvements": [],
    "recommended_learning": []
}}

Rules:

- match_score must be a number from 0 to 100.
- matching_skills must contain skills found in both the resume and job description.
- missing_skills must contain important job-related skills missing from the resume.
- strengths must contain specific strengths supported by the resume.
- improvements must contain practical suggestions for improving the resume or skills.
- recommended_learning must contain useful technologies, concepts, or skills the candidate should learn.
- Do not invent experience that is not present in the resume.
- Keep each list concise and useful.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    import json

    try:
        analysis = json.loads(response.text)

        return {
            "analysis": analysis
        }

    except json.JSONDecodeError:

        return {
            "analysis": {
                "match_score": 0,
                "matching_skills": [],
                "missing_skills": [],
                "strengths": [],
                "improvements": [
                    "The AI response could not be converted into structured data."
                ],
                "recommended_learning": [],
                "raw_response": response.text
            }
        }