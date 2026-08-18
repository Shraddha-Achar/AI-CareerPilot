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

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ai-careerpilot-1.onrender.com",
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
            model="gemini-3.1-flash-lite",
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

# ============================================================
# AI MOCK INTERVIEW
# ============================================================

class MockInterviewStartRequest(BaseModel):
    resume: str
    job_description: str
    previous_questions: list[str] = []


class MockInterviewNextRequest(BaseModel):
    resume: str
    job_description: str
    previous_questions: list[str] = []
    previous_evaluations: list[dict] = []


class MockInterviewAnswerRequest(BaseModel):
    resume: str
    job_description: str
    question: str
    answer: str


class MockInterviewFinalReportRequest(BaseModel):
    resume: str
    job_description: str
    evaluations: list[dict]


# ============================================================
# START MOCK INTERVIEW
# ============================================================

@app.post("/api/mock-interview/start")
async def start_mock_interview(request: MockInterviewStartRequest):

    prompt = f"""
You are an expert technical interviewer conducting a realistic
mock interview for an entry-level candidate.

Your task is to create the FIRST interview question using ONLY:
1. The candidate's resume.
2. The target job description.
3. General technical knowledge appropriate for the target role.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

PREVIOUS QUESTIONS:
{request.previous_questions}

IMPORTANT RESUME-GROUNDING RULES:

- The candidate may only be questioned about experience, projects,
  responsibilities, technologies, achievements, or activities that
  are explicitly supported by the resume.
- Never assume that the candidate performed a task simply because
  it is common for the target role.
- Never invent a project, responsibility, optimization, achievement,
  metric, technology, certification, or work experience.
- If asking about the candidate's experience, base the question on
  something explicitly mentioned in the resume.
- Technical questions may test standard knowledge required by the
  job description even if that knowledge is not listed in the resume.
- If a technology appears only in the job description and not in the
  resume, treat it as a knowledge question, NOT as previous experience.
- Ask exactly ONE question.
- The question must be appropriate for an entry-level candidate.
- Do not repeat or closely rephrase any previous question.

Choose the most useful first question for the candidate.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "question": "Interview question here",
    "category": "Technical",
    "difficulty": "Medium",
    "why_asked": "Why this question is relevant to the candidate and role"
}}

Return valid JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        result = json.loads(response.text)

        return {
            "success": True,
            "question": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# NEXT MOCK INTERVIEW QUESTION
# ============================================================

@app.post("/api/mock-interview/next")
async def next_mock_interview(request: MockInterviewNextRequest):

    prompt = f"""
You are an expert technical interviewer conducting a realistic
mock interview for an entry-level candidate.

Create the NEXT interview question.

Use:
1. The candidate's resume.
2. The target job description.
3. Questions already asked.
4. Previous interview evaluations.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

QUESTIONS ALREADY ASKED:
{request.previous_questions}

PREVIOUS EVALUATIONS:
{request.previous_evaluations}

IMPORTANT:

- Ask exactly ONE new question.
- Never repeat or closely rephrase a previous question.
- Do not invent candidate experience.
- If asking about resume experience, use ONLY facts explicitly
  mentioned in the resume.
- Do not assume the candidate has used a technology just because
  it appears in the job description.
- Technologies in the job description that are absent from the
  resume may be tested as knowledge questions, but must NOT be
  presented as previous experience.
- Use previous evaluations to make the interview progressive when
  appropriate.
- If the candidate performed poorly on a concept, a follow-up or
  foundational question may be useful.
- If the candidate performed well, gradually increase difficulty.
- Do not create fictional projects, achievements, metrics,
  responsibilities, or work situations.
- Keep the question suitable for an entry-level candidate.
- The question must be relevant to the target role.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "question": "Interview question here",
    "category": "Technical",
    "difficulty": "Medium",
    "why_asked": "Why this question is relevant to the candidate and role"
}}

Return valid JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        result = json.loads(response.text)

        return {
            "success": True,
            "question": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# EVALUATE MOCK INTERVIEW ANSWER
# ============================================================

@app.post("/api/mock-interview/evaluate")
async def evaluate_mock_interview(
    request: MockInterviewAnswerRequest
):

    prompt = f"""
You are an expert technical interviewer and interview coach.

Evaluate the candidate's answer to the interview question.

Your evaluation must be fair, constructive, technically accurate,
and strictly grounded in the information provided.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

INTERVIEW QUESTION:
{request.question}

CANDIDATE ANSWER:
{request.answer}

Evaluate the answer using these four dimensions:

1. RELEVANCE
Did the candidate actually answer the question that was asked?

2. TECHNICAL CORRECTNESS
Are the technical statements accurate and appropriate?

3. RESUME AUTHENTICITY
Did the candidate make claims about experience, projects,
technologies, responsibilities, achievements, or metrics that
are unsupported by the resume or their answer?

4. COMMUNICATION
Was the answer clear, structured, concise, and easy to understand?

IMPORTANT RULES FOR THE BETTER ANSWER:

- Improve the candidate's actual answer.
- Preserve the candidate's real experience.
- NEVER invent a project, responsibility, technology, achievement,
  metric, optimization, company experience, or work situation.
- NEVER create a fictional example and present it as something
  the candidate actually did.
- Do not add technologies merely because they appear in the
  job description.
- If the candidate's answer lacks enough information for a
  specific example, explicitly say so.
- When information is missing, provide a safe answer structure
  or explain what the candidate should include instead.
- If giving an example, clearly label it as a hypothetical example.
- Do not fabricate numbers such as percentages, performance gains,
  user counts, time savings, or other metrics.

SCORING GUIDELINES:

9-10 = Excellent answer: directly answers the question, technically
      correct, relevant, clear, and sufficiently detailed.

7-8 = Good answer: mostly correct and relevant, with minor gaps.

5-6 = Partially satisfactory: some correct information but important
      details are missing or the answer is only partly relevant.

3-4 = Weak answer: significant relevance, technical, or communication
      problems.

0-2 = Very poor answer: incorrect, irrelevant, or fails to answer
      the question.

Do not give a high score simply because the answer contains
technically correct information. The answer must address the
actual question.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "score": 0,
    "strengths": [],
    "improvements": [],
    "feedback": "",
    "better_answer": ""
}}

Rules:

- score must be a number from 0 to 10.
- strengths must contain specific positive aspects of the answer.
- improvements must contain practical and actionable suggestions.
- feedback must be constructive interviewer-style feedback.
- better_answer must improve the candidate's answer without
  inventing experience.
- Return valid JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        result = json.loads(response.text)

        return {
            "success": True,
            "evaluation": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# FINAL MOCK INTERVIEW REPORT
# ============================================================

@app.post("/api/mock-interview/final-report")
async def generate_mock_interview_final_report(
    request: MockInterviewFinalReportRequest
):

    prompt = f"""
You are an expert technical interviewer and career coach.

Generate a final performance report for the candidate based ONLY
on their resume, target job description, interview questions,
candidate answers, and evaluations.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

INTERVIEW EVALUATIONS:
{request.evaluations}

IMPORTANT:

- Do not invent experience, projects, skills, achievements,
  responsibilities, or technologies.
- Do not assume that the candidate has experience with a technology
  simply because it appears in the job description.
- Evaluate only what the candidate actually demonstrated.
- Do not reward answers merely for containing technical keywords.
- Relevance to the actual questions must strongly influence the score.
- If the candidate repeatedly gives answers unrelated to questions,
  relevance_score should reflect that.
- Recommended topics may include technologies or concepts from the
  job description that the candidate should study, even if they
  are absent from the resume. Clearly treat these as study topics,
  not existing skills.

SCORING:

overall_score:
Overall interview performance based on technical knowledge,
communication, and relevance.

technical_score:
Technical correctness and understanding demonstrated in answers.

communication_score:
Clarity, structure, completeness, and professionalism.

relevance_score:
How directly the candidate answered the questions asked.

All scores must be from 0 to 10.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "overall_score": 0,
    "technical_score": 0,
    "communication_score": 0,
    "relevance_score": 0,
    "strongest_areas": [],
    "areas_to_improve": [],
    "recommended_topics": [],
    "final_feedback": ""
}}

Rules:

- strongest_areas must be based on demonstrated performance.
- areas_to_improve must be specific and actionable.
- recommended_topics should help the candidate prepare for the
  target role.
- final_feedback must be concise, professional, and constructive.
- Never fabricate candidate experience.
- Return valid JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        result = json.loads(response.text)

        return {
            "success": True,
            "report": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# JOB READINESS DASHBOARD
# ============================================================

class JobReadinessRequest(BaseModel):
    match_score: float | None = None
    ats_score: float | None = None
    interview_overall: float | None = None
    communication_score: float | None = None
    relevance_score: float | None = None


@app.post("/api/job-readiness")
async def job_readiness(request: JobReadinessRequest):
    """
    Combines the existing Resume/Career Analysis and Mock Interview
    results into one dashboard-ready score.

    Resume component:
      - 60% job match
      - 40% ATS compatibility

    Interview component:
      - overall interview score

    Final readiness:
      - 55% resume component
      - 45% interview component

    If the interview report is not available yet, the endpoint returns
    a resume-only score and marks the interview as pending.
    """

    match = max(0, min(100, float(request.match_score or 0)))
    ats = max(0, min(100, float(request.ats_score or 0)))

    resume_score = round((match * 0.60) + (ats * 0.40))

    has_interview = request.interview_overall is not None
    interview_score = (
        max(0, min(100, float(request.interview_overall) * 10))
        if has_interview
        else None
    )

    if has_interview:
        readiness = round((resume_score * 0.55) + (interview_score * 0.45))
    else:
        readiness = resume_score

    recommendations = []

    if match < 70:
        recommendations.append(
            "Improve resume-to-job alignment by addressing important missing skills and keywords."
        )

    if ats < 70:
        recommendations.append(
            "Improve ATS compatibility by strengthening keyword optimization and resume structure."
        )

    if has_interview and interview_score < 70:
        recommendations.append(
            "Practice more mock interview questions and focus on answering the exact question asked."
        )

    if has_interview and request.communication_score is not None:
        communication = max(0, min(100, float(request.communication_score) * 10))
        if communication < 70:
            recommendations.append(
                "Practice clearer, more structured, and concise interview responses."
            )

    if has_interview and request.relevance_score is not None:
        relevance = max(0, min(100, float(request.relevance_score) * 10))
        if relevance < 70:
            recommendations.append(
                "Focus on directly addressing the interview question before adding supporting details."
            )

    if not recommendations:
        recommendations.append(
            "Keep practicing and maintain your current strengths across resume and interview preparation."
        )

    return {
        "success": True,
        "job_readiness": readiness,
        "resume_score": resume_score,
        "match_score": round(match),
        "ats_score": round(ats),
        "interview_score": round(interview_score) if interview_score is not None else None,
        "communication_score": (
            round(max(0, min(100, float(request.communication_score) * 10)))
            if request.communication_score is not None
            else None
        ),
        "relevance_score": (
            round(max(0, min(100, float(request.relevance_score) * 10)))
            if request.relevance_score is not None
            else None
        ),
        "interview_pending": not has_interview,
        "recommendations": recommendations,
    }


# ============================================
# AI INTERVIEW PREPARATION ENDPOINT
# ============================================

class InterviewPrepRequest(BaseModel):
    resume: str
    job_description: str


@app.post("/api/interview-prep")
async def interview_prep(request: InterviewPrepRequest):

    prompt = f"""
You are an expert technical interviewer, HR interviewer,
and career coach.

Create a personalized interview preparation plan for the candidate
based ONLY on the resume and target job description provided below.

CANDIDATE RESUME:
{request.resume}

TARGET JOB DESCRIPTION:
{request.job_description}

Generate interview preparation in exactly this JSON structure:

{{
    "technical_questions": [
        {{
            "question": "",
            "difficulty": "",
            "why_asked": "",
            "key_points": []
        }}
    ],

    "hr_questions": [
        {{
            "question": "",
            "suggested_answer": ""
        }}
    ],

    "resume_questions": [
        {{
            "question": "",
            "what_to_prepare": ""
        }}
    ],

    "skill_based_questions": [
        {{
            "skill": "",
            "question": "",
            "key_points": []
        }}
    ],

    "preparation_topics": [],

    "interview_tips": []
}}

RULES:

1. Generate 5 technical questions relevant to the target job.
2. Generate 5 HR questions suitable for an entry-level candidate.
3. Generate 5 questions specifically based on projects,
   education, skills, or experience mentioned in the resume.
4. Generate 5 skill-based questions focusing on important
   technologies mentioned in the job description.
5. Include 5 important preparation topics.
6. Include 5 practical interview tips.
7. Questions should match the candidate's experience level.
8. Do not invent projects, experience, certifications, or skills.
9. If a technology appears in the job description but not in
   the resume, treat it as a preparation topic rather than
   claiming the candidate knows it.
10. Return ONLY valid JSON.
11. Do not use Markdown.
12. Do not include ```json.
13. Do not add explanations outside the JSON.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt
        )

        import json

        try:

            interview_data = json.loads(response.text)

            return {
                "success": True,
                "interview": interview_data
            }

        except json.JSONDecodeError:

            return {
                "success": False,
                "error": "AI response could not be converted into structured data.",
                "raw_response": response.text
            }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }