import { useEffect, useState } from "react";

const messages = [
  "📄 Parsing your resume",
  "🧠 Understanding the job description",
  "🔍 Matching your skills",
  "🤖 Generating AI recommendations",
  "✨ Preparing your report",
];

function LoadingStatus() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 1800);

    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <p className="loading-status">
      {messages[messageIndex]}
      <span className="loading-dots">{dots}</span>
    </p>
  );
}

export default LoadingStatus;