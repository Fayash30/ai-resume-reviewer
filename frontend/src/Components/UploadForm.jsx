import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function UploadForm({ onResult }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      setResume(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setResume(null);
      setError("Please upload a PDF resume.");
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resume || !jobDescription.trim()) {
      setError("Upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setError("");
    onResult(null);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("job_description", jobDescription);

      const response = await fetch(`${API_URL}/review`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to analyze the resume."
        );
      }

      onResult(data);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="analyzer-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <span className="step">01</span>
          <h2>Analyze your resume</h2>
        </div>

        <span className="secure-label">PDF only</span>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Resume</label>

          <label className={`upload-box ${resume ? "selected" : ""}`}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />

            <div className="upload-icon">↑</div>

            {resume ? (
              <>
                <strong>{resume.name}</strong>
                <span>Ready to analyze</span>
              </>
            ) : (
              <>
                <strong>Upload your resume</strong>
                <span>Choose a PDF file</span>
              </>
            )}
          </label>
        </div>

        <div className="field">
          <label htmlFor="job-description">Job Description</label>

          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            minLength={50}
            required
          />

          <span className="character-count">
            {jobDescription.length} characters
          </span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="analyze-button"
        type="submit"
        disabled={
          loading ||
          !resume ||
          jobDescription.trim().length < 50
        }
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Analyzing resume...
          </>
        ) : (
          <>
            Analyze Resume
            <span>→</span>
          </>
        )}
      </button>

      {loading && (
        <p className="loading-hint">
          Comparing your experience against the job requirements...
        </p>
      )}
    </form>
  );
}

export default UploadForm;