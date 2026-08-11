import { useState } from "react";

function CareerAnalyzer() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both your resume and the job description.");
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

  return (
    <section className="analyzer-page">

      {/* HEADER */}

      <div className="analyzer-header">
        <p className="badge">AI CAREER ANALYZER</p>

        <h1>
          Analyze Your <span>Career</span>
        </h1>

        <p>
          Compare your resume with a target job description and
          discover where you stand.
        </p>
      </div>


      {/* INPUTS */}

      <div className="analyzer-container">

        {/* RESUME */}

        <div className="input-card">

          <h2>📄 Your Resume</h2>

          <p>
            Upload your resume PDF or paste your resume below.
          </p>

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
        <p className="upload-status">
        🤖 Extracting your resume...
        </p>
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

        <div className="character-count">
          {resume.length} characters
        </div>

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

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}


      {/* BUTTON */}

      <div className="analyze-section">

        <button
          className="primary-button analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "🤖 Analyzing..." : "🚀 Analyze My Career"}
        </button>

      </div>


      {/* RESULTS */}

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


          {/* SKILLS */}

          <div className="result-grid">

            <div className="result-card">

              <h2>✅ Matching Skills</h2>

              <div className="tag-container">

                {analysis.matching_skills?.map((skill, index) => (
                  <span className="skill-tag" key={index}>
                    {skill}
                  </span>
                ))}

              </div>

            </div>


            <div className="result-card">

              <h2>⚠️ Skill Gaps</h2>

              <div className="tag-container">

                {analysis.missing_skills?.map((skill, index) => (
                  <span className="gap-tag" key={index}>
                    {skill}
                  </span>
                ))}

              </div>

            </div>

          </div>


          {/* STRENGTHS */}

          <div className="result-card full-card">

            <h2>💪 Your Strengths</h2>

            <ul>
              {analysis.strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>


          {/* IMPROVEMENTS */}

          <div className="result-card full-card">

            <h2>📈 Areas to Improve</h2>

            <ul>
              {analysis.improvements?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>


          {/* LEARNING */}

          <div className="result-card full-card">

            <h2>📚 Recommended Learning</h2>

            <ul>
              {analysis.recommended_learning?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

        </div>
      )}

    </section>
  );
}

export default CareerAnalyzer;