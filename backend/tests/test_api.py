from fastapi.testclient import TestClient
from unittest.mock import patch

from backend.main import app


client = TestClient(app)

def test_info_endpoint():
    response = client.get("/info")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "AI Resume Reviewer"
    assert data["version"] == "1.0.0"


def test_reject_non_pdf():
    files = {
        "resume": (
            "resume.txt",
            b"This is definitely not a PDF resume.",
            "text/plain"
        )
    }

    data = {
        "job_description": (
            "We are looking for an AI Engineer with Python, "
            "FastAPI, Generative AI, RAG and backend experience."
        )
    }

    response = client.post(
        "/review",
        files=files,
        data=data
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Only PDF resumes are supported."


def test_reject_short_job_description():
    files = {
        "resume": (
            "resume.pdf",
            b"%PDF-1.4 fake pdf",
            "application/pdf"
        )
    }

    data = {
        "job_description": "Python developer"
    }

    response = client.post(
        "/review",
        files=files,
        data=data
    )

    assert response.status_code == 422


def test_review_success():
    fake_response = {
        "match_score": 92,
        "strengths": ["Python", "FastAPI"],
        "weaknesses": [],
        "matched_keywords": ["Python", "FastAPI"],
        "missing_keywords": [],
        "recommendations": [],
        "summary": "Excellent match."
    }

    files = {
        "resume": (
            "resume.pdf",
            b"fake pdf bytes",
            "application/pdf"
        )
    }

    data = {
        "job_description": (
            "We are looking for a Software Engineer with Python, "
            "FastAPI, SQL, REST APIs and backend development experience."
        )
    }

    with patch("backend.main.extract_pdf_text", return_value="Experienced Python developer with FastAPI and SQL skills."), \
         patch("backend.main.analyze_resume", return_value=fake_response):

        response = client.post(
            "/review",
            files=files,
            data=data
        )

    assert response.status_code == 200

    result = response.json()

    assert result["match_score"] == 92
    assert result["summary"] == "Excellent match."
    assert result["strengths"] == ["Python", "FastAPI"]