import os
import io
import json

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader
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
You are an expert AI career advisor, resume analyst, ATS specialist, and technical recruiter.

Analyze the candidate's resume against the target job description.

RESUME:
{request.resume}

JOB DESCRIPTION:
{request.job_description}

Return ONLY valid JSON.

Do not use Markdown.
Do not use ```json.
Do not add explanations outside the JSON.

Use EXACTLY this structure:

{{
    "match_score": 0,

    "matching_skills": [],

    "missing_skills": [],

    "strengths": [],

    "improvements": [],

    "recommended_learning": [],

    "ats_score": 0,

    "ats_analysis": {{
        "keyword_optimization": 0,
        "skills_relevance": 0,
        "resume_structure": 0,
        "job_alignment": 0
    }},

    "ats_issues": [],

    "ats_recommendations": []
}}

RULES:

1. match_score must be a number from 0 to 100.

2. matching_skills must contain important skills found in BOTH the resume and job description.

3. missing_skills must contain important job-related skills that are missing from the resume.

4. strengths must contain specific strengths supported by the resume.

5. improvements must contain practical suggestions for improving the resume.

6. recommended_learning must contain useful technologies, concepts, or skills the candidate should learn.

7. ats_score must be a number from 0 to 100.

8. keyword_optimization must be a number from 0 to 100 representing how well the resume contains important keywords from the job description.

9. skills_relevance must be a number from 0 to 100 representing how closely the candidate's technical skills match the requirements of the job.

10. resume_structure must be a number from 0 to 100 representing how well the resume is organized and ATS-friendly.

11. job_alignment must be a number from 0 to 100 representing how closely the overall resume aligns with the target job.

12. ats_issues must contain specific ATS-related problems found in the resume.

13. ats_recommendations must contain practical actions that would improve the ATS score.

14. Do not invent experience, projects, certifications, technologies, or achievements that are not present in the resume.

15. Keep all lists concise, specific, and useful.

16. Make the analysis specific to the provided resume and job description.

17. The ATS score should reflect the quality and relevance of the actual resume, not simply the match score.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    import json

    try:
        response_text = response.text.strip()

        # Remove accidental Markdown code fences if Gemini adds them
        if response_text.startswith("```json"):
            response_text = response_text[7:]

        elif response_text.startswith("```"):
            response_text = response_text[3:]

        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        analysis = json.loads(response_text)

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

                "ats_score": 0,

                "ats_analysis": {
                    "keyword_optimization": 0,
                    "skills_relevance": 0,
                    "resume_structure": 0,
                    "job_alignment": 0
                },

                "ats_issues": [
                    "The AI response could not be converted into structured ATS data."
                ],

                "ats_recommendations": [
                    "Try analyzing the resume again."
                ],

                "raw_response": response.text
            }
        }

@app.post("/api/extract-resume")
async def extract_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    file_data = await file.read()

    try:
        pdf = PdfReader(io.BytesIO(file_data))

        extracted_text = ""

        for page in pdf.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF."
            )

        return {
            "filename": file.filename,
            "text": extracted_text.strip()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not process PDF: {str(e)}"
        )


class ResumeImprovementRequest(BaseModel):
    resume: str
    job_description: str


@app.post("/api/improve-resume")
async def improve_resume(request: ResumeImprovementRequest):

    prompt = f"""
You are an expert technical recruiter and professional resume writer.

Analyze the candidate's resume against the target job description.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

Provide a professional resume improvement analysis.

Return your response using exactly these sections:

IMPROVED SUMMARY:
Write a concise, ATS-friendly professional summary tailored to the target role.

RESUME IMPROVEMENTS:
Provide 5 specific improvements the candidate should make to their resume.

MISSING KEYWORDS:
List important technical skills, tools, technologies, or keywords from the job description
that are missing or weakly represented in the resume.

JOB-SPECIFIC SUGGESTIONS:
Provide 5 actionable suggestions to make the resume stronger for this particular role.

Do not invent experience, projects, skills, certifications, or achievements that are not present in the resume.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        return {
            "success": True,
            "improvement": response.text
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }