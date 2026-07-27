from schemas import ResumeReviewResponse
import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def build_resume_prompt(resume: str, job_description: str) -> str:
    return f"""
You are an experienced technical recruiter reviewing a resume
for AI Engineer roles.

Evaluate how well the supplied resume matches the supplied job description.

Use the job description only to determine the role's requirements.
Use only the resume as evidence of the candidate's skills, experience,
education, projects, and qualifications.

Do not assume the candidate has a requirement simply because it appears
in the job description.

----- START JOB DESCRIPTION -----

{job_description}

----- END JOB DESCRIPTION -----

Focus on:
- AI/ML skills
- LLM/Generative AI skills
- Backend and API skills
- Projects
- Professional experience
- ATS compatibility

Calculate the match score from 0 to 100 using:

- Required technical skills: 40%
- Relevant professional experience: 25%
- Relevant projects: 15%
- Education/certifications when required: 10%
- Overall role/ATS alignment: 10%

identify strengths and weaknesses, matched and missing keywords, and provide recommendations for improvement.

Do not invent experience, skills, projects, or qualifications
that are not present in the resume.


When a job requirement lists alternatives using terms such as
"or", satisfying any one acceptable alternative satisfies that requirement.
Do not list the other alternatives as missing keywords.

Treat required qualifications as more important than preferred qualifications.
Missing preferred qualifications should reduce the score only slightly.
Do not award points for skills or experience that are not explicitly supported
by the resume.
pip install pypdf python-multipart
----- START RESUME -----

{resume}

----- END RESUME -----
"""

# def test_gemini():
#     response = client.models.generate_content(
#         model="gemini-3-flash-preview",
#         contents="Reply with exactly: Gemini connection successful"
#     )

#     return response.text


# print(test_gemini())
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3-flash-preview"
)
def analyze_resume(resume: str, job_description: str) -> ResumeReviewResponse:

    prompt = build_resume_prompt(resume, job_description)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeReviewResponse,
        },
    )

    return ResumeReviewResponse.model_validate_json(
        response.text
    )

def get_app_name():
    return "AI Resume Reviewer API"

def get_project_metadata():
    return {
        "name": "AI Resume Reviewer",
        "version": "1.0.0",
        "author": "Mohamed Fayash"
    }