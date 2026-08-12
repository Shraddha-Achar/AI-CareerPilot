
import { useState } from "react";

function CareerAnalyzer() {
  // ================================
  // STATE
  // ================================

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
      const response = await fetch(
        "http://127.0.0.1:8000/api/extract-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract resume.");
      }

      const data = await response.json();

      setResume(data.text);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to extract your resume. Please try another PDF."
      );
    } finally {
      setUploading(false);
    }
  };


  // ================================
  // CAREER ANALYSIS
  // ================================

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError(
        "Please provide both your resume and the job description."
      );
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/analyze-career",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze your career.");
      }

      const data = await response.json();

      setAnalysis(data.analysis);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the AI server. Please make sure the backend is running."
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
        "Please provide both your resume and the job description first."
      );
      return;
    }

    setImprovingResume(true);
    setError("");
    setResumeImprovement(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/improve-resume",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resume: resume,
            job_description: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to improve resume.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || "Resume improvement failed."
        );
      }

      setResumeImprovement(data.improvement);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to generate resume improvements. Please try again."
      );
    } finally {
      setImprovingResume(false);
    }
  };


  // ================================
  // UI
  // ================================

  return (
    <section className="analyzer-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="analyzer-header">

        <p className="badge">
          AI CAREER ANALYZER
        </p>

        <h1>
          Analyze Your <span>Career</span>
        </h1>

        <p>
          Compare your resume with a target job description
          and discover where you stand.
        </p>

      </div>


      {/* ================================
          INPUT SECTION
      ================================= */}

      <div className="analyzer-container">


        {/* ================================
            RESUME CARD
        ================================= */}

        <div className="input-card">

          <h2>
            📄 Your Resume
          </h2>

          <p>
            Upload your resume PDF or paste your resume below.
          </p>


          {/* PDF UPLOAD */}

          <label className="upload-button">

            📄 Choose Resume PDF

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              hidden
            />

          </label>


          {/* UPLOAD STATUS */}

          {uploading && (
            <p className="upload-status">
              🤖 Extracting your resume...
            </p>
          )}


          {resumeFile && !uploading && (
            <p className="upload-status">
              ✅ {resumeFile.name} uploaded successfully
            </p>
          )}


          {/* RESUME TEXT */}

          <textarea
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) =>
              setResume(e.target.value)
            }
          />


          <div className="character-count">
            {resume.length} characters
          </div>

        </div>


        {/* ================================
            JOB DESCRIPTION CARD
        ================================= */}

        <div className="input-card">

          <h2>
            💼 Target Job Description
          </h2>

          <p>
            Paste the job description you're applying for.
          </p>


          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
          />


          <div className="character-count">
            {jobDescription.length} characters
          </div>

        </div>

      </div>


      {/* ================================
          ERROR MESSAGE
      ================================= */}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}


      {/* ================================
          ACTION BUTTONS
      ================================= */}

      <div className="analyze-section">

        {/* ANALYZE BUTTON */}

        <button
          className="primary-button analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >

          {loading
            ? "🤖 Analyzing..."
            : "🚀 Analyze My Career"
          }

        </button>


        {/* IMPROVE RESUME BUTTON */}

        <button
          className="secondary-button improve-button"
          onClick={handleImproveResume}
          disabled={improvingResume}
        >

          {improvingResume
            ? "✨ Improving Resume..."
            : "✨ Improve My Resume"
          }

        </button>

      </div>


      {/* ================================
          CAREER ANALYSIS RESULTS
      ================================= */}

      {analysis && (

        <div className="career-results">


          {/* MATCH SCORE */}

          <div className="score-card">

            <div>

              <p className="result-label">
                RESUME MATCH SCORE
              </p>

              <h2>
                {analysis.match_score}%
              </h2>

              <p>
                How well your resume matches this job
              </p>

            </div>

          </div>


          {/* SKILLS GRID */}

          <div className="result-grid">


            {/* MATCHING SKILLS */}

            <div className="result-card">

              <h2>
                ✅ Matching Skills
              </h2>

              <div className="tag-container">

                {analysis.matching_skills?.map(
                  (skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>


            {/* SKILL GAPS */}

            <div className="result-card">

              <h2>
                ⚠️ Skill Gaps
              </h2>

              <div className="tag-container">

                {analysis.missing_skills?.map(
                  (skill, index) => (

                    <span
                      className="gap-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          {/* STRENGTHS */}

          <div className="result-card full-card">

            <h2>
              💪 Your Strengths
            </h2>

            <ul>

              {analysis.strengths?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* IMPROVEMENTS */}

          <div className="result-card full-card">

            <h2>
              📈 Areas to Improve
            </h2>

            <ul>

              {analysis.improvements?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>


          {/* RECOMMENDED LEARNING */}

          <div className="result-card full-card">

            <h2>
              📚 Recommended Learning
            </h2>

            <ul>

              {analysis.recommended_learning?.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          </div>

        </div>

      )}


      {/* ================================
          AI RESUME IMPROVEMENT
      ================================= */}

      {resumeImprovement && (

        <div className="resume-improvement-section">


          {/* HEADER */}

          <div className="improvement-header">

            <p className="badge">
              AI RESUME COACH
            </p>

            <h2>
              ✨ Resume Improvement Suggestions
            </h2>

            <p>
              Personalized recommendations based on your
              resume and target job.
            </p>

          </div>


          {/* IMPROVEMENT CARD */}

          <div className="improvement-card">

            <div className="improvement-content">

              {resumeImprovement
                .split("\n")
                .map((line, index) => (

                  <p key={index}>
                    {line}
                  </p>

                ))}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default CareerAnalyzer;
