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

  const [interviewPrep, setInterviewPrep] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewError, setInterviewError] = useState("");

  const [mockInterview, setMockInterview] = useState(null);
  const [mockInterviewLoading, setMockInterviewLoading] = useState(false);
  const [mockInterviewError, setMockInterviewError] = useState("");

  const [mockInterviewQuestionNumber, setMockInterviewQuestionNumber] =
    useState(1);

  const [mockPreviousQuestions, setMockPreviousQuestions] = useState([]);

  const [mockAnswer, setMockAnswer] = useState("");
  const [mockEvaluation, setMockEvaluation] = useState(null);
  const [mockEvaluations, setMockEvaluations] = useState([]);
  const [mockFinalReport, setMockFinalReport] = useState(null);
  const [mockFinalReportLoading, setMockFinalReportLoading] = useState(false);
  const [mockFinalReportError, setMockFinalReportError] = useState("");
  const [mockEvaluationLoading, setMockEvaluationLoading] = useState(false);
  const [mockEvaluationError, setMockEvaluationError] = useState("");

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

  const handleInterviewPrep = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setInterviewError(
        "Please provide both your resume and the job description.",
      );
      return;
    }

    setInterviewLoading(true);
    setInterviewError("");
    setInterviewPrep(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/interview-prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to generate interview preparation.",
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Interview preparation failed.");
      }

      setInterviewPrep(data.interview);
    } catch (err) {
      console.error("Interview preparation error:", err);
      setInterviewError(err.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleStartMockInterview = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setMockInterviewError(
        "Please provide both your resume and job description.",
      );
      return;
    }

    setMockInterviewLoading(true);
    setMockInterviewError("");
    setMockInterview(null);
    setMockEvaluations([]);
    setMockFinalReport(null);
    setMockFinalReportLoading(false);
    setMockFinalReportError("");
    setMockInterviewQuestionNumber(1);
    setMockPreviousQuestions([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mock-interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
            previous_questions: mockPreviousQuestions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to start mock interview.");
      }

      if (!data.success) {
        throw new Error(data.error || "Could not start mock interview.");
      }

      setMockInterview(data.question);
      setMockPreviousQuestions([data.question.question]);
    } catch (error) {
      console.error("Mock interview error:", error);
      setMockInterviewError(error.message);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const handleNextMockQuestion = async () => {
    setMockInterviewLoading(true);
    setMockInterviewError("");
    setMockEvaluation(null);
    setMockAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mock-interview/next",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
            previous_questions: mockPreviousQuestions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate next question.");
      }

      if (!data.success) {
        throw new Error(data.error || "Could not generate next question.");
      }

      setMockInterview(data.question);

      setMockPreviousQuestions([
        ...mockPreviousQuestions,
        data.question.question,
      ]);

      setMockInterviewQuestionNumber(mockInterviewQuestionNumber + 1);
    } catch (error) {
      console.error("Next question error:", error);
      setMockInterviewError(error.message);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const generateMockFinalReport = async () => {
    if (mockEvaluations.length === 0) {
      setMockFinalReportError(
        "Please complete at least one interview question first.",
      );
      return;
    }

    setMockFinalReportLoading(true);
    setMockFinalReportError("");
    setMockFinalReport(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mock-interview/final-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
            evaluations: mockEvaluations,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to generate final interview report.",
        );
      }

      if (!data.success) {
        throw new Error(
          data.error || "Could not generate final interview report.",
        );
      }

      setMockFinalReport(data.report);
    } catch (error) {
      console.error("Final interview report error:", error);
      setMockFinalReportError(error.message);
    } finally {
      setMockFinalReportLoading(false);
    }
  };

  const handleSubmitMockAnswer = async () => {
    if (!mockAnswer.trim()) {
      setMockEvaluationError("Please enter your answer before submitting.");
      return;
    }

    if (!mockInterview?.question) {
      setMockEvaluationError("No interview question is available.");
      return;
    }

    setMockEvaluationLoading(true);
    setMockEvaluationError("");
    setMockEvaluation(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/mock-interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
            question: mockInterview.question,
            answer: mockAnswer,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to evaluate your answer.");
      }

      if (!data.success) {
        throw new Error(data.error || "Could not evaluate your answer.");
      }

      setMockEvaluation(data.evaluation);
      setMockEvaluations((previousEvaluations) => [
        ...previousEvaluations,
        {
          question: mockInterview.question,
          answer: mockAnswer,
          evaluation: data.evaluation,
        },
      ]);
    } catch (error) {
      console.error("Mock interview evaluation error:", error);
      setMockEvaluationError(error.message);
    } finally {
      setMockEvaluationLoading(false);
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

      <div className="analyze-section action-buttons">
        <button
          className="primary-button analyze-button action-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "🤖 Analyzing..." : "🚀 Analyze My Career"}
        </button>

        <button
          className="secondary-button improve-button action-button"
          onClick={handleImproveResume}
          disabled={improvingResume}
        >
          {improvingResume ? "✨ Improving Resume..." : "✨ Improve My Resume"}
        </button>

        <button
          className="interview-button action-button"
          onClick={handleInterviewPrep}
          disabled={interviewLoading}
        >
          {interviewLoading
            ? "🎤 Preparing Interview..."
            : "🎤 Prepare Me for Interview"}
        </button>

        <button
          className="mock-interview-button action-button"
          onClick={handleStartMockInterview}
          disabled={mockInterviewLoading}
        >
          {mockInterviewLoading
            ? "🎤 Starting Interview..."
            : "🎤 Start Mock Interview"}
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

      {interviewError && <div className="error-message">{interviewError}</div>}

      {interviewPrep && (
        <div className="interview-results">
          <h2>🎤 AI Interview Preparation</h2>

          <section>
            <h3>💻 Technical Questions</h3>
            {interviewPrep.technical_questions?.map((question, index) => (
              <div className="interview-question" key={index}>
                <strong>
                  {index + 1}.{" "}
                  {typeof question === "string" ? question : question.question}
                </strong>

                {typeof question !== "string" && question.difficulty && (
                  <div>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </div>
                )}

                {typeof question !== "string" && question.why_asked && (
                  <div>
                    <strong>Why it's asked:</strong> {question.why_asked}
                  </div>
                )}

                {typeof question !== "string" &&
                  question.key_points?.length > 0 && (
                    <div>
                      <strong>Key points:</strong>
                      <ul>
                        {question.key_points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </section>

          <section>
            <h3>👤 HR Questions</h3>
            {interviewPrep.hr_questions?.map((question, index) => (
              <div className="interview-question" key={index}>
                <strong>
                  {index + 1}.{" "}
                  {typeof question === "string" ? question : question.question}
                </strong>

                {typeof question !== "string" && question.difficulty && (
                  <div>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </div>
                )}

                {typeof question !== "string" && question.why_asked && (
                  <div>
                    <strong>Why it's asked:</strong> {question.why_asked}
                  </div>
                )}

                {typeof question !== "string" &&
                  question.key_points?.length > 0 && (
                    <div>
                      <strong>Key points:</strong>
                      <ul>
                        {question.key_points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </section>

          <section>
            <h3>📄 Resume-Based Questions</h3>
            {interviewPrep.resume_questions?.map((question, index) => (
              <div className="interview-question" key={index}>
                <strong>
                  {index + 1}.{" "}
                  {typeof question === "string" ? question : question.question}
                </strong>

                {typeof question !== "string" && question.difficulty && (
                  <div>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </div>
                )}

                {typeof question !== "string" && question.why_asked && (
                  <div>
                    <strong>Why it's asked:</strong> {question.why_asked}
                  </div>
                )}

                {typeof question !== "string" &&
                  question.key_points?.length > 0 && (
                    <div>
                      <strong>Key points:</strong>
                      <ul>
                        {question.key_points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </section>

          <section>
            <h3>🧠 Skill-Based Questions</h3>
            {interviewPrep.skill_based_questions?.map((question, index) => (
              <div className="interview-question" key={index}>
                <strong>
                  {index + 1}.{" "}
                  {typeof question === "string" ? question : question.question}
                </strong>

                {typeof question !== "string" && question.difficulty && (
                  <div>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </div>
                )}

                {typeof question !== "string" && question.why_asked && (
                  <div>
                    <strong>Why it's asked:</strong> {question.why_asked}
                  </div>
                )}

                {typeof question !== "string" &&
                  question.key_points?.length > 0 && (
                    <div>
                      <strong>Key points:</strong>
                      <ul>
                        {question.key_points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </section>

          <section>
            <h3>📚 Preparation Topics</h3>
            <ul>
              {interviewPrep.preparation_topics?.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>💡 Interview Tips</h3>
            <ul>
              {interviewPrep.interview_tips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {mockInterviewError && (
        <div className="error-message">{mockInterviewError}</div>
      )}

      {mockInterview && (
        <div className="mock-interview-container">
          <div className="mock-interview-header">
            <span>🎤</span>

            <div>
              <h2>AI Mock Interview</h2>
              <p>Question {mockInterviewQuestionNumber}</p>
            </div>
          </div>

          <div className="mock-interview-question">
            <div className="mock-interview-meta">
              <span>{mockInterview.category}</span>
              <span>{mockInterview.difficulty}</span>
            </div>

            <h3>{mockInterview.question}</h3>

            {mockInterview.why_asked && (
              <p className="mock-interview-why">
                <strong>💡 Why this is asked:</strong> {mockInterview.why_asked}
              </p>
            )}
            {/* CANDIDATE ANSWER */}
            <div className="mock-answer-section">
              <h3>✍️ Your Answer</h3>

              <textarea
                value={mockAnswer}
                onChange={(e) => setMockAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
              />

              <button
                className="mock-submit-button"
                onClick={handleSubmitMockAnswer}
                disabled={mockEvaluationLoading}
              >
                {mockEvaluationLoading
                  ? "🤖 Evaluating..."
                  : "📤 Submit Answer"}
              </button>
            </div>

            {/* EVALUATION ERROR */}
            {mockEvaluationError && (
              <div className="error-message">{mockEvaluationError}</div>
            )}

            {/* AI EVALUATION */}
            {mockEvaluation && (
              <div className="mock-evaluation">
                <h2>📊 Interview Evaluation</h2>

                <div className="mock-score">
                  <strong>Score:</strong> {mockEvaluation.score}/10
                </div>

                <section>
                  <h3>💪 Strengths</h3>
                  <ul>
                    {mockEvaluation.strengths?.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>🔧 Improvements</h3>
                  <ul>
                    {mockEvaluation.improvements?.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>💬 Interviewer Feedback</h3>
                  <p>{mockEvaluation.feedback}</p>
                </section>

                <section>
                  <h3>✨ Better Answer</h3>
                  <p>{mockEvaluation.better_answer}</p>
                </section>
              </div>
            )}
            {mockInterviewQuestionNumber < 5 ? (
              <button
                className="mock-next-button"
                onClick={handleNextMockQuestion}
                disabled={mockInterviewLoading}
              >
                {mockInterviewLoading ? "🤖 Preparing..." : "➡️ Next Question"}
              </button>
            ) : (
              <button
                className="mock-next-button"
                onClick={generateMockFinalReport}
                disabled={mockFinalReportLoading}
              >
                {mockFinalReportLoading
                  ? "🤖 Generating Report..."
                  : "🏆 Finish Interview"}
              </button>
            )}
          </div>
        </div>
      )}

      {mockFinalReportError && (
        <div className="error-message">{mockFinalReportError}</div>
      )}

      {mockFinalReport && (
        <div className="mock-final-report">
          <div className="final-report-header">
            <div className="final-report-icon">🏆</div>

            <div>
              <h2>Interview Complete!</h2>
              <p>Here is your overall AI interview assessment.</p>
            </div>
          </div>

          {/* OVERALL SCORE */}
          <div className="final-overall-score">
            <span>Overall Score</span>

            <strong>{mockFinalReport.overall_score}/10</strong>
          </div>

          {/* PERFORMANCE SCORES */}
          <div className="final-score-grid">
            <div className="final-score-card">
              <span>💻</span>
              <h3>Technical</h3>
              <strong>{mockFinalReport.technical_score}/10</strong>
            </div>

            <div className="final-score-card">
              <span>🗣️</span>
              <h3>Communication</h3>
              <strong>{mockFinalReport.communication_score}/10</strong>
            </div>

            <div className="final-score-card">
              <span>🎯</span>
              <h3>Relevance</h3>
              <strong>{mockFinalReport.relevance_score}/10</strong>
            </div>
          </div>

          {/* STRONGEST AREAS */}
          <section className="final-report-section">
            <h3>💪 Strongest Areas</h3>

            <ul>
              {mockFinalReport.strongest_areas?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </section>

          {/* AREAS TO IMPROVE */}
          <section className="final-report-section">
            <h3>🔧 Areas to Improve</h3>

            <ul>
              {mockFinalReport.areas_to_improve?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </section>

          {/* RECOMMENDED TOPICS */}
          <section className="final-report-section">
            <h3>📚 Recommended Topics</h3>

            <ul>
              {mockFinalReport.recommended_topics?.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </section>

          {/* FINAL FEEDBACK */}
          <section className="final-report-feedback">
            <h3>💬 Final Interviewer Feedback</h3>

            <p>{mockFinalReport.final_feedback}</p>
          </section>
        </div>
      )}

      {/* ================================
    ATS RESUME SCORE
================================= */}

      {analysis && analysis.ats_score !== undefined && (
        <div className="ats-results">
          {/* ATS SCORE HEADER */}

          <div className="ats-score-card">
            <div className="ats-score-info">
              <p className="ats-label">📊 ATS RESUME SCORE</p>

              <h2>{analysis.ats_score}%</h2>

              <p className="ats-status">
                {analysis.ats_score >= 80
                  ? "Excellent ATS Compatibility"
                  : analysis.ats_score >= 60
                    ? "Good ATS Compatibility"
                    : "Needs Improvement"}
              </p>

              <p className="ats-description">
                Your resume's compatibility with Applicant Tracking Systems for
                this target job.
              </p>
            </div>

            {/* ATS SCORE CIRCLE */}

            <div className="ats-circle">
              <div
                className="ats-circle-progress"
                style={{
                  "--ats-score": `${analysis.ats_score}%`,
                }}
              >
                <div className="ats-circle-inner">
                  <strong>{analysis.ats_score}%</strong>

                  <span>ATS Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* ATS BREAKDOWN */}

          <div className="ats-breakdown">
            {/* KEYWORD OPTIMIZATION */}

            <div className="ats-metric-card">
              <div className="ats-metric-icon">🔑</div>

              <div className="ats-metric-content">
                <h3>Keyword Optimization</h3>

                <div className="ats-progress">
                  <div
                    className="ats-progress-bar"
                    style={{
                      width: `${analysis.ats_analysis?.keyword_optimization || 0}%`,
                    }}
                  />
                </div>

                <strong>
                  {analysis.ats_analysis?.keyword_optimization || 0}%
                </strong>
              </div>
            </div>

            {/* SKILLS RELEVANCE */}

            <div className="ats-metric-card">
              <div className="ats-metric-icon">🧩</div>

              <div className="ats-metric-content">
                <h3>Skills Relevance</h3>

                <div className="ats-progress">
                  <div
                    className="ats-progress-bar"
                    style={{
                      width: `${analysis.ats_analysis?.skills_relevance || 0}%`,
                    }}
                  />
                </div>

                <strong>{analysis.ats_analysis?.skills_relevance || 0}%</strong>
              </div>
            </div>

            {/* RESUME STRUCTURE */}

            <div className="ats-metric-card">
              <div className="ats-metric-icon">📄</div>

              <div className="ats-metric-content">
                <h3>Resume Structure</h3>

                <div className="ats-progress">
                  <div
                    className="ats-progress-bar"
                    style={{
                      width: `${analysis.ats_analysis?.resume_structure || 0}%`,
                    }}
                  />
                </div>

                <strong>{analysis.ats_analysis?.resume_structure || 0}%</strong>
              </div>
            </div>

            {/* JOB ALIGNMENT */}

            <div className="ats-metric-card">
              <div className="ats-metric-icon">🎯</div>

              <div className="ats-metric-content">
                <h3>Job Alignment</h3>

                <div className="ats-progress">
                  <div
                    className="ats-progress-bar"
                    style={{
                      width: `${analysis.ats_analysis?.job_alignment || 0}%`,
                    }}
                  />
                </div>

                <strong>{analysis.ats_analysis?.job_alignment || 0}%</strong>
              </div>
            </div>
          </div>

          {/* ATS ISSUES */}

          <div className="ats-detail-card">
            <div className="ats-detail-header">
              <div className="ats-detail-icon warning">⚠️</div>

              <div>
                <h2>ATS Issues</h2>

                <p>Potential issues that may reduce your ATS score.</p>
              </div>
            </div>

            <div className="ats-list">
              {analysis.ats_issues?.map((issue, index) => (
                <div className="ats-list-item" key={index}>
                  <span>{index + 1}</span>

                  <p>{issue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ATS RECOMMENDATIONS */}

          <div className="ats-detail-card">
            <div className="ats-detail-header">
              <div className="ats-detail-icon recommendation">💡</div>

              <div>
                <h2>ATS Recommendations</h2>

                <p>
                  Practical steps to improve your resume's ATS compatibility.
                </p>
              </div>
            </div>

            <div className="ats-list">
              {analysis.ats_recommendations?.map((recommendation, index) => (
                <div className="ats-list-item recommendation-item" key={index}>
                  <span>✓</span>

                  <p>{recommendation}</p>
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
