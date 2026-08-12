import { useState } from "react";

function CareerAnalyzer() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const [resumeImprovement, setResumeImprovement] = useState(null);
  const [improvingResume, setImprovingResume] = useState(false);

  const [error, setError] = useState("");

  // ================================
  // PDF RESUME UPLOAD
  // ================================

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setResumeFile(file);
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/extract-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract resume.");
      }

      const data = await response.json();

      setResume(data.text);
    } catch (error) {
      console.error(error);

      setError("Unable to extract your resume. Please try another PDF.");
    } finally {
      setUploading(false);
    }
  };

  // ================================
  // CAREER ANALYSIS
  // ================================

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both your resume and the job description.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze your career.");
      }

      const data = await response.json();

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the AI server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // AI RESUME IMPROVEMENT
  // ================================

  const handleImproveResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError(
        "Please provide both your resume and the job description first.",
      );
      return;
    }

    setImprovingResume(true);
    setError("");
    setResumeImprovement(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/improve-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve resume.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Resume improvement failed.");
      }

      setResumeImprovement(data.improvement);
    } catch (error) {
      console.error(error);

      setError("Unable to generate resume improvements. Please try again.");
    } finally {
      setImprovingResume(false);
    }
  };

  // ================================
  // FORMAT AI RESPONSE
  // ================================

  const formatImprovement = (text) => {
    if (!text) {
      return {
        summary: "",
        improvements: [],
        keywords: [],
        suggestions: [],
      };
    }

    const sections = {
      summary: "",
      improvements: [],
      keywords: [],
      suggestions: [],
    };

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let currentSection = "";

    lines.forEach((line) => {
      const upperLine = line.toUpperCase();

      if (upperLine.includes("IMPROVED SUMMARY")) {
        currentSection = "summary";
        return;
      }

      if (upperLine.includes("RESUME IMPROVEMENTS")) {
        currentSection = "improvements";
        return;
      }

      if (upperLine.includes("MISSING KEYWORDS")) {
        currentSection = "keywords";
        return;
      }

      if (
        upperLine.includes("JOB-SPECIFIC SUGGESTIONS") ||
        upperLine.includes("JOB SPECIFIC SUGGESTIONS")
      ) {
        currentSection = "suggestions";
        return;
      }

      const cleanedLine = line
        .replace(/^[-•*]\s*/, "")
        .replace(/^\d+[\).\s]+/, "")
        .trim();

      if (!cleanedLine) return;

      if (currentSection === "summary") {
        sections.summary += (sections.summary ? " " : "") + cleanedLine;
      }

      if (currentSection === "improvements") {
        sections.improvements.push(cleanedLine);
      }

      if (currentSection === "keywords") {
        sections.keywords.push(cleanedLine);
      }

      if (currentSection === "suggestions") {
        sections.suggestions.push(cleanedLine);
      }
    });

    return sections;
  };

  const improvementSections = formatImprovement(resumeImprovement);

  // ================================
  // UI
  // ================================

  return (
    <section className="analyzer-page">
      {/* HEADER */}

      <div className="analyzer-header">
        <p className="badge">AI CAREER ANALYZER</p>

        <h1>
          Analyze Your <span>Career</span>
        </h1>

        <p>
          Compare your resume with a target job description and discover where
          you stand.
        </p>
      </div>

      {/* INPUT AREA */}

      <div className="analyzer-container">
        {/* RESUME */}

        <div className="input-card">
          <h2>📄 Your Resume</h2>

          <p>Upload your resume PDF or paste your resume below.</p>

          <label className="upload-button">
            📄 Choose Resume PDF
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              hidden
            />
          </label>

          {uploading && (
            <p className="upload-status">🤖 Extracting your resume...</p>
          )}

          {resumeFile && !uploading && (
            <p className="upload-status">
              ✅ {resumeFile.name} uploaded successfully
            </p>
          )}

          <textarea
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />

          <div className="character-count">{resume.length} characters</div>
        </div>

        {/* JOB DESCRIPTION */}

        <div className="input-card">
          <h2>💼 Target Job Description</h2>

          <p>Paste the job description you're applying for.</p>

          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="character-count">
            {jobDescription.length} characters
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && <div className="error-message">⚠️ {error}</div>}

      {/* BUTTONS */}

      <div className="analyze-section">
        <button
          className="primary-button analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "🤖 Analyzing..." : "🚀 Analyze My Career"}
        </button>

        <button
          className="secondary-button improve-button"
          onClick={handleImproveResume}
          disabled={improvingResume}
        >
          {improvingResume ? "✨ Improving Resume..." : "✨ Improve My Resume"}
        </button>
      </div>

      {/* ================================
    CAREER ANALYSIS DASHBOARD
================================= */}

      {analysis && (
        <div className="career-results">
          {/* MATCH SCORE */}

          <div className="match-score-card">
            <div className="match-score-content">
              <div className="match-score-info">
                <p className="match-label">🎯 YOUR JOB MATCH</p>

                <h2>{analysis.match_score}%</h2>

                <p className="match-description">
                  {analysis.match_score >= 80
                    ? "Strong Match"
                    : analysis.match_score >= 60
                      ? "Good Match"
                      : "Needs Improvement"}
                </p>

                <p className="match-subtitle">
                  How well your resume matches the target job description.
                </p>
              </div>

              {/* SCORE CIRCLE */}

              <div className="score-circle">
                <div
                  className="score-circle-progress"
                  style={{
                    "--score": `${analysis.match_score}%`,
                  }}
                >
                  <div className="score-circle-inner">
                    <strong>{analysis.match_score}%</strong>

                    <span>Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS GRID */}

          <div className="result-grid">
            {/* MATCHING SKILLS */}

            <div className="result-card skill-result-card">
              <div className="result-card-header">
                <div className="result-card-icon matching-icon">✓</div>

                <div>
                  <h2>Matching Skills</h2>

                  <p>Skills you already have that match the role.</p>
                </div>
              </div>

              <div className="tag-container">
                {analysis.matching_skills?.map((skill, index) => (
                  <span className="skill-tag" key={index}>
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* SKILL GAPS */}

            <div className="result-card skill-result-card">
              <div className="result-card-header">
                <div className="result-card-icon gap-icon">!</div>

                <div>
                  <h2>Skills to Improve</h2>

                  <p>Skills that could strengthen your application.</p>
                </div>
              </div>

              <div className="tag-container">
                {analysis.missing_skills?.map((skill, index) => (
                  <span className="gap-tag" key={index}>
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* STRENGTHS */}

          <div className="result-card full-card">
            <div className="result-card-header">
              <div className="result-card-icon strength-icon">💪</div>

              <div>
                <h2>Your Strengths</h2>

                <p>Areas where your profile already stands out.</p>
              </div>
            </div>

            <div className="insight-list">
              {analysis.strengths?.map((item, index) => (
                <div className="insight-item" key={index}>
                  <span className="insight-check">✓</span>

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AREAS TO IMPROVE */}

          <div className="result-card full-card">
            <div className="result-card-header">
              <div className="result-card-icon improvement-icon">📈</div>

              <div>
                <h2>Areas to Improve</h2>

                <p>Actionable changes that can improve your profile.</p>
              </div>
            </div>

            <div className="insight-list">
              {analysis.improvements?.map((item, index) => (
                <div className="insight-item improvement-item" key={index}>
                  <span className="insight-number">{index + 1}</span>

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDED LEARNING */}

          <div className="result-card full-card">
            <div className="result-card-header">
              <div className="result-card-icon learning-icon">📚</div>

              <div>
                <h2>Recommended Learning</h2>

                <p>Skills and topics worth learning next.</p>
              </div>
            </div>

            <div className="learning-grid">
              {analysis.recommended_learning?.map((item, index) => (
                <div className="learning-item" key={index}>
                  <span>{index + 1}</span>

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================
          AI RESUME COACH
      ================================= */}

      {resumeImprovement && (
        <div className="resume-coach">
          <div className="coach-header">
            <div className="coach-icon">✨</div>

            <div>
              <p className="coach-label">AI RESUME COACH</p>

              <h2>Make Your Resume Stronger</h2>

              <p>
                Personalized recommendations based on your resume and target
                job.
              </p>
            </div>
          </div>

          {/* SUMMARY */}

          {improvementSections.summary && (
            <div className="coach-card summary-card">
              <div className="coach-card-title">
                <span>📝</span>

                <div>
                  <h3>Improved Professional Summary</h3>

                  <p>A stronger summary tailored to your target role.</p>
                </div>
              </div>

              <div className="summary-text">{improvementSections.summary}</div>
            </div>
          )}

          {/* IMPROVEMENTS */}

          {improvementSections.improvements.length > 0 && (
            <div className="coach-card">
              <div className="coach-card-title">
                <span>📈</span>

                <div>
                  <h3>Resume Improvements</h3>

                  <p>Changes that can make your resume more effective.</p>
                </div>
              </div>

              <div className="coach-list">
                {improvementSections.improvements.map((item, index) => (
                  <div className="coach-list-item" key={index}>
                    <span className="number">{index + 1}</span>

                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KEYWORDS */}

          {improvementSections.keywords.length > 0 && (
            <div className="coach-card">
              <div className="coach-card-title">
                <span>🔑</span>

                <div>
                  <h3>Missing Keywords</h3>

                  <p>
                    Important skills or technologies mentioned in the job
                    description.
                  </p>
                </div>
              </div>

              <div className="keyword-container">
                {improvementSections.keywords.map((keyword, index) => (
                  <span className="keyword-pill" key={index}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SUGGESTIONS */}

          {improvementSections.suggestions.length > 0 && (
            <div className="coach-card">
              <div className="coach-card-title">
                <span>🎯</span>

                <div>
                  <h3>Job-Specific Suggestions</h3>

                  <p>Actionable ways to improve your chances for this role.</p>
                </div>
              </div>

              <div className="coach-list">
                {improvementSections.suggestions.map((item, index) => (
                  <div className="coach-list-item" key={index}>
                    <span className="number">{index + 1}</span>

                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default CareerAnalyzer;
