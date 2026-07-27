from fastapi import FastAPI, Depends, HTTPException
from schemas import ResumeRequest, ResumeReviewResponse
from services import analyze_resume, get_project_metadata

app = FastAPI()

@app.get("/info")
def info(project_metadata: dict = Depends(get_project_metadata)):
    return project_metadata


@app.post(
    "/review",
    response_model=ResumeReviewResponse
)
def review_resume(request: ResumeRequest):
    try:
        return analyze_resume(request.resume, request.job_description)

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
