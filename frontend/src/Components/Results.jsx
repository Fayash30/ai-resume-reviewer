import ScoreCircle from "./ScoreCircle";
import Skeleton from "./Skeleton";
import LoadingStatus from "./LoadingStatus";



function ListCard({ title, items, type }) {
  return (
    <article className="result-card">
      <div className="card-title">
        <span className={`indicator ${type}`}></span>
        <h3>{title}</h3>
      </div>

      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function KeywordGroup({ title, keywords, type }) {
  return (
    <div className="keyword-group">
      <h3>{title}</h3>

      <div className="keywords">
        {keywords.map((keyword, index) => (
          <span
            className={`keyword ${type}`}
            key={`${keyword}-${index}`}
          >
            {type === "matched" ? "✓" : "×"} {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function Results({ result, loading }) {

  if (loading) {
  return (
    <section className="results">

      <div className="section-heading">
        <span className="step">02</span>

        <div>
          <h2>Your analysis</h2>
          <LoadingStatus />
        </div>
      </div>

      <div className="overview-card">
        <Skeleton className="skeleton-circle" />

        <div className="summary">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-text" />
          <Skeleton className="skeleton-text short" />
        </div>
      </div>

      <div className="two-column">

        <article className="result-card">
          <Skeleton className="skeleton-heading" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line short" />
        </article>

        <article className="result-card">
          <Skeleton className="skeleton-heading" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line short" />
        </article>

      </div>

      <article className="result-card">
        <Skeleton className="skeleton-heading" />
        <Skeleton className="skeleton-chip" />
        <Skeleton className="skeleton-chip" />
        <Skeleton className="skeleton-chip" />
        <Skeleton className="skeleton-chip" />
      </article>

    </section>
  );
}

  return (
    <section className="results">
      <div className="section-heading">
        <span className="step">02</span>
        <div>
          <h2>Your analysis</h2>
          <p>AI-generated comparison against the supplied job description.</p>
        </div>
      </div>

      <div className="overview-card">
        <ScoreCircle score={result.match_score} />

        <div className="summary">
          <span className="eyebrow">OVERALL MATCH</span>
          <h2>
            {result.match_score >= 85
              ? "Strong match"
              : result.match_score >= 65
              ? "Good foundation"
              : "Needs improvement"}
          </h2>

          <p>{result.summary}</p>
        </div>
      </div>

      <div className="two-column">
        <ListCard
          title="Strengths"
          items={result.strengths}
          type="positive"
        />

        <ListCard
          title="Weaknesses"
          items={result.weaknesses}
          type="negative"
        />
      </div>

      <div className="result-card keyword-card">
        <KeywordGroup
          title="Matched Keywords"
          keywords={result.matched_keywords}
          type="matched"
        />

        <KeywordGroup
          title="Missing Keywords"
          keywords={result.missing_keywords}
          type="missing"
        />
      </div>

      <article className="result-card recommendations">
        <div className="card-title">
          <span className="indicator recommendation"></span>
          <h3>Recommendations</h3>
        </div>

        <div className="recommendation-list">
          {result.recommendations.map((recommendation, index) => (
            <div
              className="recommendation-item"
              key={`recommendation-${index}`}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Results;