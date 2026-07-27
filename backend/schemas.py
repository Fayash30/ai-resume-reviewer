from pydantic import BaseModel, Field


class ResumeRequest(BaseModel):
    resume: str = Field(
        min_length=50,
        description="Extracted resume text to analyze"
    )
    job_description: str = Field(
        min_length=50,
        description="Job description for context"
    )

class ResumeReviewResponse(BaseModel):
    match_score: int = Field(ge=0, le=100)
    strengths: list[str]
    weaknesses: list[str]
    matched_keywords: list[str]
    missing_keywords: list[str]
    recommendations: list[str]
    summary: str
    