import { useState } from "react";
import UploadForm from "./Components/UploadForm";
import Results from "./Components/Results";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="app">
      <header className="hero">
        <div className="brand">
          <div className="brand-icon">AI</div>
          <span>ResumeMatch</span>
        </div>

        <div className="hero-content">
          <span className="eyebrow">AI-POWERED RESUME ANALYSIS</span>

          <h1>
            See how well your resume
            <span> matches the job.</span>
          </h1>

          <p>
            Upload your resume and paste a job description to get an
            AI-powered match analysis, missing skills, and actionable
            recommendations.
          </p>
        </div>
      </header>

      <section className="container">
        <UploadForm
          onResult={setResult}
          loading={loading}
          setLoading={setLoading}
        />

        {(loading || result) && (
        <Results
          result={result}
          loading={loading}
        />
      )}
      </section>

    </main>
  );
}

export default App;