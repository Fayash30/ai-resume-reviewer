function ScoreCircle({ score }) {
  const safeScore = Math.max(0, Math.min(score, 100));

  return (
    <div
      className="score-circle"
      style={{ "--score": `${safeScore * 3.6}deg` }}
    >
      <div className="score-inner">
        <strong>{safeScore}%</strong>
        <span>Match</span>
      </div>
    </div>
  );
}

export default ScoreCircle;