from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from schemas import ResumeRequest, ResumeReviewResponse
from services import analyze_resume, get_project_metadata
from utils.pdf import extract_pdf_text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/info")
def info(project_metadata: dict = Depends(get_project_metadata)):
    return project_metadata


@app.post(
    "/review",
    response_model=ResumeReviewResponse
)
async def review_resume( resume: UploadFile = File(...), job_description: str = Form(..., min_length=50)):

    if resume.content_type != "application/pdf":
        raise HTTPException(
        status_code=400,
        detail="Only PDF resumes are supported."
    )
    

    try:
        file_bytes = await resume.read()
        resume_text = extract_pdf_text(file_bytes)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded PDF."
        )

    if len(resume_text) < 50:
        raise HTTPException(
        status_code=400,
        detail="Could not extract sufficient text from the PDF."
    )
    try:
        return analyze_resume(resume_text, job_description)

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="AI review service is temporarily unavailable."
        )

@app.get("/about")
def about():
    return {
        "project": "AI Resume Reviewer",
        "version": "1.0.0",
        "author": "Mohamed Fayash"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
