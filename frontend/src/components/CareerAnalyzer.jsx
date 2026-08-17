import { useEffect, useState } from "react";
import "./career-dashboard.css";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
function CareerAnalyzer() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // ================================
  // PHASE 9.2A - JOB APPLICATION TRACKER
  // ================================

  const [jobApplications, setJobApplications] = useState([]);

  const [jobApplicationForm, setJobApplicationForm] = useState({
    company: "",
    role: "",
    applicationDate: "",
    jobLink: "",
    status: "Applied",
    notes: "",
  });

  const JOB_APPLICATIONS_KEY = "aiCareerPilotJobApplications";
  const [editingJobApplicationId, setEditingJobApplicationId] = useState(null);
  const [jobTrackerMessage, setJobTrackerMessage] = useState("");
  // ================================
  // PHASE 9.2E - SEARCH & FILTER
  // ================================
  const [jobApplicationSearch, setJobApplicationSearch] = useState("");
  const [jobApplicationStatusFilter, setJobApplicationStatusFilter] =
    useState("All");

  // Load saved job applications when the tracker opens.
  useEffect(() => {
    try {
      const savedApplications = localStorage.getItem(JOB_APPLICATIONS_KEY);
      if (savedApplications) {
        const parsedApplications = JSON.parse(savedApplications);
        if (Array.isArray(parsedApplications)) {
          setJobApplications(parsedApplications);
        }
      }
    } catch (jobApplicationError) {
      console.error("Could not load job applications:", jobApplicationError);
    }
  }, []);

  const saveJobApplications = (applications) => {
    try {
      localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
    } catch (jobApplicationError) {
      console.error("Could not save job applications:", jobApplicationError);
    }
  };

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
  // JOB READINESS DASHBOARD
  // ================================
  const [jobReadiness, setJobReadiness] = useState(null);
  const [jobReadinessLoading, setJobReadinessLoading] = useState(false);
  const [jobReadinessError, setJobReadinessError] = useState("");

  // ================================
  // CAREER PROGRESS HISTORY
  // ================================
  const CAREER_HISTORY_KEY = "aiCareerPilotCareerHistory";
  const [careerHistory, setCareerHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // ================================
  // RESUME VERSION HISTORY
  // ================================
  const RESUME_VERSION_KEY = "aiCareerPilotResumeVersions";

  const [resumeVersions, setResumeVersions] = useState([]);
  const [resumeVersionsLoaded, setResumeVersionsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedResumeVersions = localStorage.getItem(RESUME_VERSION_KEY);

      if (savedResumeVersions) {
        const parsedResumeVersions = JSON.parse(savedResumeVersions);

        if (Array.isArray(parsedResumeVersions)) {
          setResumeVersions(parsedResumeVersions);
        }
      }
    } catch (resumeVersionError) {
      console.error("Could not load resume versions:", resumeVersionError);
    } finally {
      setResumeVersionsLoaded(true);
    }
  }, []);

  // ================================
  // CAREER PROFILE
  // ================================
  const CAREER_PROFILE_KEY = "aiCareerPilotCareerProfile";
  const [careerProfile, setCareerProfile] = useState({
    name: "",
    targetRole: "",
    experienceLevel: "",
    skills: "",
    careerGoal: "",
  });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(CAREER_PROFILE_KEY);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile && typeof parsedProfile === "object") {
          setCareerProfile((previous) => ({ ...previous, ...parsedProfile }));
        }
      }
    } catch (profileError) {
      console.error("Could not load career profile:", profileError);
    }
  }, []);

  const updateCareerProfile = (field, value) => {
    setCareerProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
    setProfileSaved(false);
  };

  const saveCareerProfile = () => {
    try {
      localStorage.setItem(CAREER_PROFILE_KEY, JSON.stringify(careerProfile));
      setProfileEditing(false);
      setProfileSaved(true);
      window.setTimeout(() => setProfileSaved(false), 2500);
    } catch (profileError) {
      console.error("Could not save career profile:", profileError);
    }
  };

  const cancelProfileEdit = () => {
    try {
      const savedProfile = localStorage.getItem(CAREER_PROFILE_KEY);
      if (savedProfile) {
        setCareerProfile(JSON.parse(savedProfile));
      }
    } catch (profileError) {
      console.error("Could not restore career profile:", profileError);
    }
    setProfileEditing(false);
    setProfileSaved(false);
  };

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CAREER_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setCareerHistory(parsedHistory);
        }
      }
    } catch (historyError) {
      console.error("Could not load career history:", historyError);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  // ================================
  // PHASE 9.2A - JOB TRACKER HANDLERS
  // ================================

  const updateJobApplicationField = (field, value) => {
    setJobApplicationForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setJobTrackerMessage("");
  };

  const resetJobApplicationForm = () => {
    setJobApplicationForm({
      company: "",
      role: "",
      applicationDate: "",
      jobLink: "",
      status: "Applied",
      notes: "",
    });
  };

  const addJobApplication = (event) => {
    event.preventDefault();

    if (
      !jobApplicationForm.company.trim() ||
      !jobApplicationForm.role.trim() ||
      !jobApplicationForm.applicationDate
    ) {
      setJobTrackerMessage(
        "Please enter the company, job role, and application date.",
      );
      return;
    }

    if (editingJobApplicationId !== null) {
      const updatedApplications = jobApplications.map((application) =>
        application.id === editingJobApplicationId
          ? {
              ...application,
              company: jobApplicationForm.company.trim(),
              role: jobApplicationForm.role.trim(),
              applicationDate: jobApplicationForm.applicationDate,
              jobLink: jobApplicationForm.jobLink.trim(),
              status: jobApplicationForm.status,
              notes: jobApplicationForm.notes.trim(),
            }
          : application,
      );

      setJobApplications(updatedApplications);
      saveJobApplications(updatedApplications);
      resetJobApplicationForm();
      setEditingJobApplicationId(null);
      setJobTrackerMessage("✅ Application updated successfully.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      company: jobApplicationForm.company.trim(),
      role: jobApplicationForm.role.trim(),
      applicationDate: jobApplicationForm.applicationDate,
      jobLink: jobApplicationForm.jobLink.trim(),
      status: jobApplicationForm.status,
      notes: jobApplicationForm.notes.trim(),
    };

    const updatedApplications = [newApplication, ...jobApplications];
    setJobApplications(updatedApplications);
    saveJobApplications(updatedApplications);
    resetJobApplicationForm();
    setJobTrackerMessage("✅ Application added successfully.");
  };

  const editJobApplication = (application) => {
    setJobApplicationForm({
      company: application.company || "",
      role: application.role || "",
      applicationDate: application.applicationDate || "",
      jobLink: application.jobLink || "",
      status: application.status || "Applied",
      notes: application.notes || "",
    });

    setEditingJobApplicationId(application.id);
    setJobTrackerMessage(
      "✏️ Editing this application. Update the details above.",
    );

    window.setTimeout(() => {
      document.querySelector(".job-tracker-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const cancelJobApplicationEdit = () => {
    resetJobApplicationForm();
    setEditingJobApplicationId(null);
    setJobTrackerMessage("");
  };

  // ================================
  // PHASE 9.2F - DELETE APPLICATION
  // ================================

  const deleteJobApplication = (application) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the application for ${application.company}?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedApplications = jobApplications.filter(
      (item) => item.id !== application.id,
    );

    setJobApplications(updatedApplications);
    saveJobApplications(updatedApplications);

    // If the deleted application was being edited, cancel the edit mode.
    if (editingJobApplicationId === application.id) {
      resetJobApplicationForm();
      setEditingJobApplicationId(null);
    }

    setJobTrackerMessage("🗑️ Application deleted successfully.");
  };

  // ================================
  // PHASE 9.2D - JOB TRACKER STATISTICS
  // ================================

  const jobTrackerStats = {
    total: jobApplications.length,
    applied: jobApplications.filter(
      (application) => application.status === "Applied",
    ).length,
    shortlisted: jobApplications.filter(
      (application) => application.status === "Shortlisted",
    ).length,
    interview: jobApplications.filter(
      (application) => application.status === "Interview",
    ).length,
    offer: jobApplications.filter(
      (application) => application.status === "Offer",
    ).length,
    rejected: jobApplications.filter(
      (application) => application.status === "Rejected",
    ).length,
  };

  const filteredJobApplications = jobApplications.filter((application) => {
    const searchTerm = jobApplicationSearch.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      application.company.toLowerCase().includes(searchTerm) ||
      application.role.toLowerCase().includes(searchTerm);

    const matchesStatus =
      jobApplicationStatusFilter === "All" ||
      application.status === jobApplicationStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const clearJobApplicationFilters = () => {
    setJobApplicationSearch("");
    setJobApplicationStatusFilter("All");
  };

  // ================================
  // SAVE RESUME VERSIONS
  // ================================
  const saveResumeVersions = (versions) => {
    try {
      localStorage.setItem(RESUME_VERSION_KEY, JSON.stringify(versions));

      setResumeVersions(versions);
    } catch (resumeVersionError) {
      console.error("Could not save resume versions:", resumeVersionError);
    }
  };

  // ================================
  // CREATE RESUME VERSION
  // ================================
  const createResumeVersion = (file, extractedText) => {
    const nextVersionNumber =
      resumeVersions.length > 0
        ? Math.max(
            ...resumeVersions.map((version) => Number(version.version) || 0),
          ) + 1
        : 1;

    const newVersion = {
      id: Date.now(),
      version: nextVersionNumber,
      filename: file?.name || "resume.pdf",
      uploadedAt: new Date().toISOString(),
      resumeText: extractedText,
      targetRole: "",
      matchScore: null,
      atsScore: null,
      jobReadiness: null,
    };

    const updatedVersions = [newVersion, ...resumeVersions];

    saveResumeVersions(updatedVersions);

    return newVersion;
  };

  // ================================
  // UPDATE LATEST RESUME VERSION SCORES
  // ================================
  const updateLatestResumeVersionScores = (readinessResult) => {
    if (!readinessResult) return;

    try {
      const savedVersions = localStorage.getItem(RESUME_VERSION_KEY);

      if (!savedVersions) return;

      const versions = JSON.parse(savedVersions);

      if (!Array.isArray(versions) || versions.length === 0) {
        return;
      }

      const updatedVersions = [...versions];

      updatedVersions[0] = {
        ...updatedVersions[0],

        targetRole: careerProfile?.targetRole || "",

        jobReadiness: readinessResult.job_readiness ?? null,
        matchScore: readinessResult.match_score ?? null,
        atsScore: readinessResult.ats_score ?? null,
        interviewScore: readinessResult.interview_score ?? null,
        communicationScore: readinessResult.communication_score ?? null,
        relevanceScore: readinessResult.relevance_score ?? null,

        analyzedAt: new Date().toISOString(),
      };

      localStorage.setItem(RESUME_VERSION_KEY, JSON.stringify(updatedVersions));

      setResumeVersions(updatedVersions);
    } catch (resumeVersionError) {
      console.error(
        "Could not update resume version scores:",
        resumeVersionError,
      );
    }
  };

  // ========================================
  // PHASE 8.2A - RESUME VERSION COMPARISON
  // ========================================

  const resumeComparison = (() => {
    // We need at least two versions to compare
    if (!resumeVersions || resumeVersions.length < 2) {
      return null;
    }

    // Newest version is stored at index 0
    const currentVersion = resumeVersions[0];

    // Previous version is stored at index 1
    const previousVersion = resumeVersions[1];

    const getScoreChange = (current, previous) => {
      const currentScore = Number(current);
      const previousScore = Number(previous);

      if (Number.isNaN(currentScore) || Number.isNaN(previousScore)) {
        return null;
      }

      return currentScore - previousScore;
    };

    return {
      currentVersion,
      previousVersion,

      jobMatchChange: getScoreChange(
        currentVersion.matchScore,
        previousVersion.matchScore,
      ),

      atsChange: getScoreChange(
        currentVersion.atsScore,
        previousVersion.atsScore,
      ),

      interviewChange: getScoreChange(
        currentVersion.interviewScore,
        previousVersion.interviewScore,
      ),

      readinessChange: getScoreChange(
        currentVersion.jobReadiness,
        previousVersion.jobReadiness,
      ),
    };
  })();

  // ========================================
  // PHASE 8.2C-A - RESUME PROGRESS INSIGHTS
  // ========================================

  const resumeProgressInsights = (() => {
    // Progress insights require at least two resume versions
    if (!resumeComparison) {
      return null;
    }

    const metrics = [
      {
        id: "jobMatch",
        title: "Job Match",
        icon: "🎯",
        change: resumeComparison.jobMatchChange,
      },
      {
        id: "ats",
        title: "ATS Score",
        icon: "🤖",
        change: resumeComparison.atsChange,
      },
      {
        id: "interview",
        title: "Interview Performance",
        icon: "🎤",
        change: resumeComparison.interviewChange,
      },
      {
        id: "readiness",
        title: "Job Readiness",
        icon: "🚀",
        change: resumeComparison.readinessChange,
      },
    ];

    // Remove metrics where a valid comparison could not be calculated
    const validMetrics = metrics.filter(
      (metric) => metric.change !== null && !Number.isNaN(metric.change),
    );

    if (!validMetrics.length) {
      return null;
    }

    // Calculate overall average score change
    const totalChange = validMetrics.reduce(
      (total, metric) => total + metric.change,
      0,
    );

    const overallChange = Math.round(totalChange / validMetrics.length);

    const { biggestImprovement, biggestDecline } = validMetrics.reduce(
      (result, metric) => {
        if (
          !result.biggestImprovement ||
          metric.change > result.biggestImprovement.change
        ) {
          result.biggestImprovement = metric;
        }

        if (
          !result.biggestDecline ||
          metric.change < result.biggestDecline.change
        ) {
          result.biggestDecline = metric;
        }

        return result;
      },
      {
        biggestImprovement: null,
        biggestDecline: null,
      },
    );

    // Find all improved areas
    const improvedAreas = validMetrics.filter((metric) => metric.change > 0);

    // Find all areas that declined
    const declinedAreas = validMetrics.filter((metric) => metric.change < 0);

    // Find areas with no meaningful change
    const unchangedAreas = validMetrics.filter((metric) => metric.change === 0);

    // Determine overall progress status
    let progressStatus = "neutral";
    let progressTitle = "Your resume is holding steady.";
    let progressMessage =
      "There has not been a significant overall change between these resume versions.";

    if (overallChange >= 10) {
      progressStatus = "excellent";
      progressTitle = "Excellent resume improvement!";
      progressMessage =
        "Your latest resume shows strong improvement across your career readiness metrics.";
    } else if (overallChange >= 5) {
      progressStatus = "positive";
      progressTitle = "Good progress!";
      progressMessage =
        "Your latest resume is improving and becoming better aligned with your target role.";
    } else if (overallChange > 0) {
      progressStatus = "slight";
      progressTitle = "You're making progress.";
      progressMessage =
        "Your latest resume has improved slightly. A few focused changes could create a bigger impact.";
    } else if (overallChange < 0) {
      progressStatus = "negative";
      progressTitle = "Your resume needs some attention.";
      progressMessage =
        "Some important career readiness metrics have decreased compared with your previous version.";
    }

    // Generate a practical next-step recommendation
    let recommendation =
      "Continue refining your resume and compare your next version to track improvement.";

    if (biggestDecline && biggestDecline.change < 0) {
      recommendation = `Focus on improving your ${biggestDecline.title.toLowerCase()}, which decreased by ${Math.abs(
        biggestDecline.change,
      )} points.`;
    } else if (biggestImprovement && biggestImprovement.change > 0) {
      recommendation = `Keep building on your ${biggestImprovement.title.toLowerCase()}, which improved by ${biggestImprovement.change} points.`;
    }

    return {
      metrics: validMetrics,

      overallChange,

      progressStatus,
      progressTitle,
      progressMessage,

      biggestImprovement:
        biggestImprovement?.change > 0 ? biggestImprovement : null,

      biggestDecline: biggestDecline?.change < 0 ? biggestDecline : null,

      improvedAreas,
      declinedAreas,
      unchangedAreas,

      recommendation,
    };
  })();

  const saveCareerAttempt = (latestAnalysis, report, readinessResult) => {
    if (!latestAnalysis || !report || !readinessResult) return;

    const attempt = {
      id: Date.now(),
      date: new Date().toISOString(),
      jobTitle:
        jobDescription
          .split("\n")
          .map((line) => line.trim())
          .find((line) => line.length > 0)
          ?.slice(0, 80) || "Target Role",
      jobReadiness: readinessResult.job_readiness,
      matchScore: readinessResult.match_score,
      atsScore: readinessResult.ats_score,
      interviewScore: readinessResult.interview_score,
      communicationScore: readinessResult.communication_score,
      relevanceScore: readinessResult.relevance_score,
    };
    updateLatestResumeVersionScores(readinessResult);

    setCareerHistory((previousHistory) => {
      const updatedHistory = [attempt, ...previousHistory].slice(0, 12);

      try {
        localStorage.setItem(
          CAREER_HISTORY_KEY,
          JSON.stringify(updatedHistory),
        );
      } catch (historyError) {
        console.error("Could not save career history:", historyError);
      }

      return updatedHistory;
    });
  };

  const clearCareerHistory = () => {
    const confirmed = window.confirm(
      "Clear all saved career progress history from this browser?",
    );

    if (!confirmed) return;

    localStorage.removeItem(CAREER_HISTORY_KEY);
    setCareerHistory([]);
  };

  // ================================
  // CAREER ANALYTICS & INSIGHTS
  // ================================
  // ================================
  // PHASE 8.3A - CAREER ANALYTICS & TRENDS
  // ================================

  const careerAnalytics = (() => {
    // No saved attempts yet
    if (!careerHistory.length) {
      return {
        strongest: null,
        weakest: null,

        averageScore: 0,
        bestScore: 0,
        currentScore: 0,
        scoreChange: 0,

        bestReadiness: 0,
        bestInterview: 0,

        trendData: [],

        readinessChange: 0,

        trendText:
          "Complete another mock interview to start building your career progress trend.",

        trendType: "neutral",
      };
    }

    // ========================================
    // ANALYTICS METRICS
    // ========================================

    const metrics = [
      {
        key: "matchScore",
        label: "Resume Match",
        icon: "📄",
      },
      {
        key: "atsScore",
        label: "ATS Compatibility",
        icon: "🤖",
      },
      {
        key: "interviewScore",
        label: "Interview",
        icon: "🎤",
      },
      {
        key: "communicationScore",
        label: "Communication",
        icon: "💬",
      },
      {
        key: "relevanceScore",
        label: "Answer Relevance",
        icon: "🎯",
      },
    ];

    // ========================================
    // CURRENT ATTEMPT
    // ========================================

    const latest = careerHistory[0];

    const metricValues = metrics.map((metric) => ({
      ...metric,
      value: Number(latest[metric.key] ?? 0),
    }));

    // ========================================
    // STRONGEST METRIC
    // ========================================

    const strongest = metricValues.reduce(
      (best, metric) => (metric.value > best.value ? metric : best),
      metricValues[0],
    );

    // ========================================
    // WEAKEST METRIC
    // ========================================

    const weakest = metricValues.reduce(
      (worst, metric) => (metric.value < worst.value ? metric : worst),
      metricValues[0],
    );

    // ========================================
    // OVERALL SCORE FOR EACH ATTEMPT
    // ========================================

    const trendData = careerHistory
      .map((attempt, index) => {
        const values = [
          Number(attempt.matchScore ?? 0),
          Number(attempt.atsScore ?? 0),
          Number(attempt.interviewScore ?? 0),
          Number(attempt.communicationScore ?? 0),
          Number(attempt.relevanceScore ?? 0),
          Number(attempt.jobReadiness ?? 0),
        ];

        const total = values.reduce((sum, value) => sum + value, 0);

        const average =
          values.length > 0 ? Math.round(total / values.length) : 0;

        return {
          attemptNumber: careerHistory.length - index,

          score: average,

          readiness: Number(attempt.jobReadiness ?? 0),

          interview: Number(attempt.interviewScore ?? 0),

          date: attempt.date,

          jobTitle: attempt.jobTitle || "Target Role",
        };
      })
      .reverse();

    // ========================================
    // CURRENT / BEST / AVERAGE
    // ========================================

    const scores = trendData.map((item) => item.score);

    const currentScore = scores.length > 0 ? scores[scores.length - 1] : 0;

    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length,
          )
        : 0;

    // ========================================
    // SCORE CHANGE
    // ========================================

    const scoreChange =
      trendData.length > 1
        ? trendData[trendData.length - 1].score -
          trendData[trendData.length - 2].score
        : 0;

    // ========================================
    // BEST READINESS
    // ========================================

    const bestReadiness = Math.max(
      ...careerHistory.map((attempt) => Number(attempt.jobReadiness ?? 0)),
    );

    // ========================================
    // BEST INTERVIEW SCORE
    // ========================================

    const bestInterview = Math.max(
      ...careerHistory.map((attempt) => Number(attempt.interviewScore ?? 0)),
    );

    // ========================================
    // READINESS CHANGE
    // ========================================

    const readinessChange =
      careerHistory.length > 1
        ? Number(careerHistory[0].jobReadiness ?? 0) -
          Number(careerHistory[1].jobReadiness ?? 0)
        : 0;

    // ========================================
    // TREND MESSAGE
    // ========================================

    let trendText = "Your first saved attempt is now recorded.";

    let trendType = "neutral";

    if (careerHistory.length > 1) {
      if (scoreChange > 0) {
        trendText = `Your overall career score improved by ${scoreChange}% compared with your previous attempt.`;

        trendType = "positive";
      } else if (scoreChange < 0) {
        trendText = `Your overall career score decreased by ${Math.abs(
          scoreChange,
        )}% compared with your previous attempt.`;

        trendType = "negative";
      } else {
        trendText =
          "Your overall career score is unchanged from your previous attempt.";

        trendType = "neutral";
      }
    }

    // ========================================
    // RETURN ANALYTICS
    // ========================================

    return {
      strongest,

      weakest,

      averageScore,

      bestScore,

      currentScore,

      scoreChange,

      bestReadiness,

      bestInterview,

      trendData,

      readinessChange,

      trendText,

      trendType,
    };
  })();

  // ========================================
  // PHASE 8.4A - CAREER ACTION CENTER LOGIC
  // ========================================

  const careerActionCenter = (() => {
    // No career attempt available yet
    if (!careerHistory.length) {
      return {
        priority: null,
        priorityScore: 0,
        priorityLabel: "Complete Your First Assessment",
        priorityIcon: "🎯",
        title: "Start your career assessment",
        description:
          "Complete a career assessment or mock interview to discover your strengths and areas that need improvement.",
        actionLabel: "Start Assessment",
        actionType: "assessment",
        target: "assessment",
        urgency: "neutral",

        areas: [],
      };
    }

    const latest = careerHistory[0];

    // ========================================
    // CURRENT PERFORMANCE AREAS
    // ========================================

    const areas = [
      {
        key: "matchScore",
        label: "Resume Match",
        icon: "📄",
        score: Number(latest.matchScore ?? 0),
        actionLabel: "Improve Resume",
        actionType: "resume",
        target: "resume",
      },

      {
        key: "atsScore",
        label: "ATS Compatibility",
        icon: "🤖",
        score: Number(latest.atsScore ?? 0),
        actionLabel: "Optimize ATS Score",
        actionType: "resume",
        target: "resume",
      },

      {
        key: "interviewScore",
        label: "Interview Performance",
        icon: "🎤",
        score: Number(latest.interviewScore ?? 0),
        actionLabel: "Practice Interview",
        actionType: "interview",
        target: "practice",
      },

      {
        key: "communicationScore",
        label: "Communication",
        icon: "💬",
        score: Number(latest.communicationScore ?? 0),
        actionLabel: "Improve Communication",
        actionType: "practice",
        target: "practice",
      },

      {
        key: "relevanceScore",
        label: "Answer Relevance",
        icon: "🎯",
        score: Number(latest.relevanceScore ?? 0),
        actionLabel: "Improve Answer Quality",
        actionType: "practice",
        target: "practice",
      },

      {
        key: "jobReadiness",
        label: "Job Readiness",
        icon: "🚀",
        score: Number(latest.jobReadiness ?? 0),
        actionLabel: "Improve Job Readiness",
        actionType: "readiness",
        target: "roadmap",
      },
    ];

    // ========================================
    // FIND HIGHEST PRIORITY AREA
    // ========================================

    const weakestArea = [...areas].sort((a, b) => a.score - b.score)[0];

    // ========================================
    // DETERMINE PRIORITY / URGENCY
    // ========================================

    let urgency = "low";
    let priorityLabel = "Keep Building";
    let priorityIcon = "📈";

    if (weakestArea.score < 40) {
      urgency = "high";
      priorityLabel = "High Priority";
      priorityIcon = "🚨";
    } else if (weakestArea.score < 60) {
      urgency = "medium";
      priorityLabel = "Needs Attention";
      priorityIcon = "⚠️";
    } else if (weakestArea.score < 75) {
      urgency = "low";
      priorityLabel = "Room to Improve";
      priorityIcon = "📈";
    } else {
      urgency = "excellent";
      priorityLabel = "Strong Performance";
      priorityIcon = "🏆";
    }

    // ========================================
    // CREATE PERSONALIZED RECOMMENDATION
    // ========================================

    let title = "";
    let description = "";

    switch (weakestArea.key) {
      case "matchScore":
        title = "Strengthen your resume-job alignment";
        description =
          "Your resume could be better aligned with your target role. Focus on relevant skills, keywords, and measurable achievements.";
        break;

      case "atsScore":
        title = "Make your resume more ATS-friendly";
        description =
          "Improve your resume structure, keywords, formatting, and job-specific terminology so it can perform better with applicant tracking systems.";
        break;

      case "interviewScore":
        title = "Strengthen your interview performance";
        description =
          "Practice answering common interview questions, improve answer structure, and build confidence with repeated mock interviews.";
        break;

      case "communicationScore":
        title = "Improve your communication skills";
        description =
          "Focus on giving clearer, more structured, and concise answers while practicing confident communication.";
        break;

      case "relevanceScore":
        title = "Improve answer relevance";
        description =
          "Focus on directly answering the question, supporting your response with examples, and avoiding unnecessary information.";
        break;

      case "jobReadiness":
        title = "Increase your overall job readiness";
        description =
          "Work on your weakest career skills and complete targeted practice activities to become more prepared for your target role.";
        break;

      default:
        title = "Keep improving your career profile";
        description =
          "Continue practicing and improving your lowest-scoring areas to increase your overall career readiness.";
    }

    // ========================================
    // RETURN ACTION CENTER DATA
    // ========================================

    return {
      priority: weakestArea,
      priorityScore: weakestArea.score,

      priorityLabel,
      priorityIcon,

      title,
      description,

      actionLabel: weakestArea.actionLabel,
      actionType: weakestArea.actionType,
      target: weakestArea.target,

      urgency,

      areas,
    };
  })();

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
      const response = await fetch(`${API_BASE_URL}/extract-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract resume.");
      }

      const data = await response.json();

      setResume(data.text);
      // Create a new resume version
      createResumeVersion(file, data.text);
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
      const response = await fetch(`${API_BASE_URL}/analyze-career`, {
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
      generateJobReadiness(data.analysis);
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
      const response = await fetch(`${API_BASE_URL}/interview-prep`, {
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
      const response = await fetch(`${API_BASE_URL}/mock-interview/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDescription,
          previous_questions: mockPreviousQuestions,
          previous_evaluations: mockEvaluations,
        }),
      });

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
    setMockEvaluation(null);
    setMockInterviewLoading(true);
    setMockInterviewError("");
    setMockEvaluation(null);
    setMockAnswer("");

    try {
      const response = await fetch(`${API_BASE_URL}/mock-interview/next`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDescription,
          previous_questions: mockPreviousQuestions,
        }),
      });

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
        `${API_BASE_URL}/mock-interview/final-report`,
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
      const readinessResult = await generateJobReadiness(analysis, data.report);
      saveCareerAttempt(analysis, data.report, readinessResult);
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
      const response = await fetch(`${API_BASE_URL}/mock-interview/evaluate`, {
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
      });

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

  const generateJobReadiness = async (
    latestAnalysis = analysis,
    latestInterviewReport = mockFinalReport,
  ) => {
    if (!latestAnalysis) {
      setJobReadinessError("Run the career analysis first.");
      return;
    }

    setJobReadinessLoading(true);
    setJobReadinessError("");

    try {
      const report = latestInterviewReport;

      const response = await fetch(`${API_BASE_URL}/job-readiness`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_score: latestAnalysis.match_score,
          ats_score: latestAnalysis.ats_score,
          interview_overall: report?.overall_score ?? null,
          communication_score: report?.communication_score ?? null,
          relevance_score: report?.relevance_score ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.detail || data.error || "Unable to generate job readiness.",
        );
      }

      setJobReadiness(data);
      return data;
    } catch (error) {
      console.error("Job readiness error:", error);
      setJobReadinessError(error.message);
    } finally {
      setJobReadinessLoading(false);
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
      const response = await fetch(`${API_BASE_URL}/improve-resume`, {
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

      if (!cleanedLine || /^[-_*]{2,}$/.test(cleanedLine)) {
        return;
      }

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

  // ================================
  // FORMAT MARKDOWN TEXT
  // ================================

  const renderFormattedText = (text) => {
    if (!text) return null;

    const parts = String(text).split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  const improvementSections = formatImprovement(resumeImprovement);

  // ========================================
  // PHASE 7.2A + 8.5A - CAREER ROADMAP
  // ========================================

  const careerRoadmap = (() => {
    const latestAttempt = careerHistory.length > 0 ? careerHistory[0] : null;

    // ----------------------------------------
    // SCORE HELPER
    // ----------------------------------------

    const getScore = (value) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      const score = Number(value);

      if (Number.isNaN(score)) {
        return null;
      }

      return Math.max(0, Math.min(100, Math.round(score)));
    };

    // ----------------------------------------
    // NO DATA STATE
    // ----------------------------------------

    if (!careerHistory.length) {
      return {
        hasData: false,

        // Existing 7.2A fields
        targetRole: careerProfile?.targetRole || "Your Target Role",
        items: [],
        strongest: null,
        weakest: null,

        // New 8.5A fields
        currentScore: 0,
        bestScore: 0,
        improvement: 0,
        overallProgress: 0,

        currentGoal: "Complete your first career assessment",

        goalDescription:
          "Complete a resume analysis or mock interview to start building your personalized career roadmap.",

        priority: "Getting Started",
        priorityScore: 0,

        areas: [],

        milestones: [
          {
            id: "assessment",
            title: "Complete your first assessment",
            description: "Analyze your resume or complete a mock interview.",
            status: "current",
            icon: "🎯",
          },
          {
            id: "identify",
            title: "Identify your weakest area",
            description:
              "Use your career analytics to find the area that needs the most improvement.",
            status: "upcoming",
            icon: "🔍",
          },
          {
            id: "practice",
            title: "Start targeted practice",
            description:
              "Practice the skill that has the biggest impact on your career readiness.",
            status: "upcoming",
            icon: "📚",
          },
          {
            id: "improve",
            title: "Improve your career score",
            description:
              "Complete another assessment and measure your progress.",
            status: "upcoming",
            icon: "📈",
          },
        ],
      };
    }

    // ----------------------------------------
    // EXISTING ROADMAP ITEMS
    // ----------------------------------------

    const roadmapItems = [
      {
        id: "resume",
        icon: "📄",
        title: "Resume Alignment",
        label: "Resume Alignment",
        score: getScore(latestAttempt?.matchScore),
      },

      {
        id: "ats",
        icon: "🤖",
        title: "ATS Compatibility",
        label: "ATS Compatibility",
        score: getScore(latestAttempt?.atsScore),
      },

      {
        id: "interview",
        icon: "🎤",
        title: "Interview Performance",
        label: "Interview Performance",
        score: getScore(latestAttempt?.interviewScore),
      },

      {
        id: "communication",
        icon: "🗣️",
        title: "Communication",
        label: "Communication",
        score: getScore(latestAttempt?.communicationScore),
      },

      {
        id: "relevance",
        icon: "🎯",
        title: "Answer Relevance",
        label: "Answer Relevance",
        score: getScore(latestAttempt?.relevanceScore),
      },

      {
        id: "readiness",
        icon: "🚀",
        title: "Job Readiness",
        label: "Job Readiness",
        score: getScore(latestAttempt?.jobReadiness),
      },
    ];

    const availableItems = roadmapItems.filter((item) => item.score !== null);

    const { strongest, weakest } = availableItems.reduce(
      (result, item) => {
        if (!result.strongest || item.score > result.strongest.score) {
          result.strongest = item;
        }

        if (!result.weakest || item.score < result.weakest.score) {
          result.weakest = item;
        }

        return result;
      },
      {
        strongest: null,
        weakest: null,
      },
    );

    // ----------------------------------------
    // CAREER SCORES
    // ----------------------------------------

    const scores = careerHistory
      .map((item) =>
        getScore(item?.jobReadiness ?? item?.overallScore ?? item?.score),
      )
      .filter((score) => score !== null);

    const currentScore = scores[0] ?? 0;

    const bestScore = Math.max(...scores, 0);

    const firstScore = scores[scores.length - 1] ?? currentScore;

    const improvement = currentScore - firstScore;

    const overallProgress =
      bestScore > 0 ? Math.round((currentScore / bestScore) * 100) : 0;

    // ----------------------------------------
    // ANALYTICS AREAS
    // ----------------------------------------

    const areas = roadmapItems.map((item) => ({
      key: item.id,
      label: item.title,
      score: item.score ?? 0,
      icon: item.icon,
    }));

    const weakestArea = weakest || {
      label: "Interview Practice",
      score: 0,
      icon: "🎤",
    };

    // ----------------------------------------
    // CURRENT GOAL
    // ----------------------------------------

    let currentGoal = "Maintain your current performance";

    let goalDescription =
      "Continue practicing consistently and complete another assessment to track your progress.";

    if (weakestArea.score < 40) {
      currentGoal = `Improve ${weakestArea.label}`;

      goalDescription = `Your current ${weakestArea.label} score is ${weakestArea.score}%. This is your highest-priority improvement area.`;
    } else if (weakestArea.score < 60) {
      currentGoal = `Strengthen ${weakestArea.label}`;

      goalDescription = `Your ${weakestArea.label} score is ${weakestArea.score}%. Targeted practice can help move this area into a stronger range.`;
    } else if (improvement > 0) {
      currentGoal = "Continue your career progress";

      goalDescription = `Your career score has improved by ${improvement}%. Keep building on this progress with consistent practice.`;
    }

    // ----------------------------------------
    // ROADMAP MILESTONES
    // ----------------------------------------

    const milestones = [
      {
        id: "assessment",
        title: "Complete career assessment",
        description:
          "Keep your resume and interview results updated so your roadmap stays accurate.",
        status: "completed",
        icon: "✅",
      },

      {
        id: "priority",
        title: `Improve ${weakestArea.label}`,
        description: `Raise your current ${weakestArea.label} score from ${weakestArea.score}% through targeted practice.`,
        status: "current",
        icon: weakestArea.icon,
      },

      {
        id: "practice",
        title: "Complete targeted practice",
        description:
          "Focus your next practice session specifically on your priority improvement area.",
        status: "upcoming",
        icon: "📚",
      },

      {
        id: "reassess",
        title: "Complete another assessment",
        description: "Measure your improvement and update your career roadmap.",
        status: "upcoming",
        icon: "📊",
      },

      {
        id: "readiness",
        title: "Reach stronger job readiness",
        description:
          "Continue improving until your career readiness score reaches a stronger level.",
        status: "upcoming",
        icon: "🚀",
      },
    ];

    // ----------------------------------------
    // FINAL COMBINED ROADMAP OBJECT
    // ----------------------------------------

    return {
      hasData: true,

      // Existing 7.2A data
      targetRole: careerProfile?.targetRole || "Your Target Role",

      items: roadmapItems,

      strongest,
      weakest,

      // New 8.5A data
      currentScore,
      bestScore,
      improvement,
      overallProgress,

      priority: weakestArea.label,
      priorityScore: weakestArea.score,

      currentGoal,
      goalDescription,

      areas,

      milestones,
    };
  })();

  // ================================
  // PHASE 7.2B.1 - IMPROVEMENT PLAN
  // ================================

  const careerActionPlan = (() => {
    const weakest = careerRoadmap.weakest;

    const improvementPlans = {
      resume: {
        why: "Your resume can be better aligned with the target role and job requirements.",
        actions: [
          "Match your resume keywords with the target job description.",
          "Use measurable achievements instead of generic responsibilities.",
          "Highlight projects and experience most relevant to the target role.",
          "Keep your resume concise, structured, and ATS-friendly.",
        ],
      },

      ats: {
        why: "Improving ATS compatibility can help your resume perform better during automated screening.",
        actions: [
          "Include important keywords from the job description.",
          "Use standard section headings such as Skills, Experience, and Projects.",
          "Avoid unnecessary graphics, tables, or unusual formatting.",
          "Make sure your technical skills are clearly mentioned.",
        ],
      },

      interview: {
        why: "Your interview performance needs more practice to improve confidence, clarity, and technical responses.",
        actions: [
          "Practice common technical interview questions regularly.",
          "Use the STAR method when answering experience-based questions.",
          "Explain your projects clearly and confidently.",
          "Practice giving concise answers without going off-topic.",
        ],
      },

      communication: {
        why: "Stronger communication will help you express your technical knowledge more clearly during interviews.",
        actions: [
          "Practice explaining technical concepts in simple language.",
          "Speak clearly and avoid overly long answers.",
          "Practice introducing yourself and explaining your projects.",
          "Record practice answers and review your delivery.",
        ],
      },

      relevance: {
        why: "Your answers should directly address the question and remain focused on the target role.",
        actions: [
          "Read the question carefully before answering.",
          "Keep your response directly related to the question.",
          "Use examples from your projects, internship, or experience.",
          "Avoid unnecessary background information or unrelated details.",
        ],
      },
    };

    const plan = weakest ? improvementPlans[weakest.id] : null;

    const currentScore = weakest?.score ?? null;

    const targetScore =
      currentScore !== null
        ? Math.min(100, Math.max(currentScore + 30, 60))
        : 60;

    return {
      focus: weakest,
      plan,
      currentScore,
      targetScore,
    };
  })();

  // ========================================
  // PHASE 7.3A - PERSONALIZED PRACTICE GOALS
  // ========================================

  const practiceGoal = (() => {
    const focus = careerActionPlan.focus;

    const practicePlans = {
      resume: {
        goal: "Improve Resume Alignment",
        activities: [
          "Review your resume against the target job description.",
          "Add relevant keywords from the job description.",
          "Rewrite one resume bullet using a measurable achievement.",
        ],
        weeklyTarget: 3,
      },

      ats: {
        goal: "Improve ATS Compatibility",
        activities: [
          "Review your resume for important job-description keywords.",
          "Check that your Skills, Experience, and Projects sections are clearly structured.",
          "Remove unnecessary formatting that may affect ATS parsing.",
        ],
        weeklyTarget: 3,
      },

      interview: {
        goal: "Improve Interview Performance",
        activities: [
          "Practice 3 technical interview questions.",
          "Prepare 2 project-based answers using the STAR method.",
          "Practice explaining one project aloud in under two minutes.",
        ],
        weeklyTarget: 3,
      },

      communication: {
        goal: "Improve Communication",
        activities: [
          "Practice introducing yourself in under one minute.",
          "Explain one technical concept using simple language.",
          "Record one practice answer and review your delivery.",
        ],
        weeklyTarget: 3,
      },

      relevance: {
        goal: "Improve Answer Relevance",
        activities: [
          "Practice 3 interview questions and answer them directly.",
          "Practice 2 answers using the STAR method.",
          "Explain one project while staying focused on the question.",
        ],
        weeklyTarget: 3,
      },
    };

    const plan = focus ? practicePlans[focus.id] : null;

    return {
      focus,
      plan,
      currentScore: careerActionPlan.currentScore,
      targetScore: careerActionPlan.targetScore,
      weeklyTarget: plan?.weeklyTarget ?? 3,
    };
  })();

  // ========================================
  // PHASE 7.3C - PRACTICE PROGRESS TRACKING
  // ========================================

  const [completedPractice, setCompletedPractice] = useState(() => {
    try {
      const saved = localStorage.getItem("careerPracticeProgress");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load practice progress:", error);
      return [];
    }
  });

  const togglePracticeActivity = (index) => {
    setCompletedPractice((previous) => {
      const updated = previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index];

      localStorage.setItem("careerPracticeProgress", JSON.stringify(updated));

      return updated;
    });
  };

  const completedCount = completedPractice.length;

  const practiceProgress =
    practiceGoal.weeklyTarget > 0
      ? Math.min(
          100,
          Math.round((completedCount / practiceGoal.weeklyTarget) * 100),
        )
      : 0;

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

      {/* ================================
          CAREER PROFILE
      ================================ */}
      <div className="career-profile-card">
        <div className="career-profile-header">
          <div className="career-profile-title">
            <div className="career-profile-avatar">👤</div>
            <div>
              <p className="career-profile-label">MY CAREER PROFILE</p>
              <h2>{careerProfile.name || "Build Your Career Profile"}</h2>
              <p>
                Keep your career goals and skills ready for your next session.
              </p>
            </div>
          </div>

          {!profileEditing && (
            <button
              type="button"
              className="career-profile-edit-button"
              onClick={() => setProfileEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {profileEditing ? (
          <div className="career-profile-form">
            <div className="career-profile-field">
              <label>Full Name</label>
              <input
                type="text"
                value={careerProfile.name}
                onChange={(e) => updateCareerProfile("name", e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="career-profile-field">
              <label>Target Role</label>
              <input
                type="text"
                value={careerProfile.targetRole}
                onChange={(e) =>
                  updateCareerProfile("targetRole", e.target.value)
                }
                placeholder="e.g. Python Developer"
              />
            </div>

            <div className="career-profile-field">
              <label>Experience Level</label>
              <select
                value={careerProfile.experienceLevel}
                onChange={(e) =>
                  updateCareerProfile("experienceLevel", e.target.value)
                }
              >
                <option value="">Select experience level</option>
                <option value="Student">Student</option>
                <option value="Fresher">Fresher</option>
                <option value="0–2 years">0–2 years</option>
                <option value="2–5 years">2–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div className="career-profile-field">
              <label>Primary Skills</label>
              <input
                type="text"
                value={careerProfile.skills}
                onChange={(e) => updateCareerProfile("skills", e.target.value)}
                placeholder="e.g. Python, SQL, Django, React"
              />
            </div>

            <div className="career-profile-field career-profile-field-wide">
              <label>Career Goal</label>
              <textarea
                value={careerProfile.careerGoal}
                onChange={(e) =>
                  updateCareerProfile("careerGoal", e.target.value)
                }
                placeholder="What kind of role or career growth are you aiming for?"
                rows="3"
              />
            </div>

            <div className="career-profile-form-actions">
              <button
                type="button"
                className="career-profile-cancel-button"
                onClick={cancelProfileEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                className="career-profile-save-button"
                onClick={saveCareerProfile}
              >
                💾 Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="career-profile-details">
            <div className="career-profile-info-card">
              <span className="career-profile-info-icon">🎯</span>
              <div>
                <span className="career-profile-info-label">Target Role</span>
                <strong>{careerProfile.targetRole || "Not set yet"}</strong>
              </div>
            </div>

            <div className="career-profile-info-card">
              <span className="career-profile-info-icon">💼</span>
              <div>
                <span className="career-profile-info-label">Experience</span>
                <strong>
                  {careerProfile.experienceLevel || "Not set yet"}
                </strong>
              </div>
            </div>

            <div className="career-profile-info-card">
              <span className="career-profile-info-icon">💻</span>
              <div>
                <span className="career-profile-info-label">
                  Primary Skills
                </span>
                <strong>{careerProfile.skills || "Not set yet"}</strong>
              </div>
            </div>

            <div className="career-profile-info-card career-profile-info-wide">
              <span className="career-profile-info-icon">🚀</span>
              <div>
                <span className="career-profile-info-label">Career Goal</span>
                <strong>{careerProfile.careerGoal || "Not set yet"}</strong>
              </div>
            </div>
          </div>
        )}

        {profileSaved && (
          <div className="career-profile-saved-message">
            ✅ Profile saved successfully
          </div>
        )}
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

      {/* ========================================
    PHASE 8.1C - RESUME VERSION HISTORY
======================================== */}

      <section className="resume-version-history">
        <div className="resume-version-header">
          <div>
            <p className="dashboard-label">📄 RESUME HISTORY</p>

            <h2>
              Your Resume <span>Versions</span>
            </h2>

            <p>
              Track your resume versions and see how your career scores change
              over time.
            </p>
          </div>
        </div>

        <div className="resume-version-list">
          {resumeVersions.length === 0 ? (
            <div className="resume-version-empty">
              <span>📄</span>

              <h3>No resume versions yet</h3>

              <p>
                Upload and analyze your resume to create your first version.
              </p>
            </div>
          ) : (
            resumeVersions.map((version, index) => (
              <div className="resume-version-card" key={version.id || index}>
                <div className="resume-version-card-header">
                  <div className="resume-version-badges">
                    <span className="resume-version-badge">
                      Version {version.version || index + 1}
                    </span>

                    {index === 0 && (
                      <span className="resume-current-badge">Current</span>
                    )}
                  </div>

                  <span className="resume-version-date">
                    {version.analyzedAt
                      ? new Date(version.analyzedAt).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Not analyzed"}
                  </span>
                </div>

                <h3 className="resume-version-filename">
                  {version.filename || "Resume"}
                </h3>

                <div className="resume-version-scores">
                  <div className="resume-version-score">
                    <span>🎯</span>

                    <div>
                      <small>Job Match</small>

                      <strong>{version.matchScore ?? 0}%</strong>
                    </div>
                  </div>

                  <div className="resume-version-score">
                    <span>🤖</span>

                    <div>
                      <small>ATS Score</small>

                      <strong>{version.atsScore ?? 0}%</strong>
                    </div>
                  </div>

                  <div className="resume-version-score">
                    <span>🎤</span>

                    <div>
                      <small>Interview</small>

                      <strong>{version.interviewScore ?? 0}%</strong>
                    </div>
                  </div>

                  <div className="resume-version-score">
                    <span>🚀</span>

                    <div>
                      <small>Job Readiness</small>

                      <strong>{version.jobReadiness ?? 0}%</strong>
                    </div>
                  </div>
                </div>

                <div className="resume-version-footer">
                  <span>
                    Uploaded{" "}
                    {version.uploadedAt
                      ? new Date(version.uploadedAt).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </span>

                  {version.targetRole && <span>🎯 {version.targetRole}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ========================================
    PHASE 8.2B - RESUME VERSION COMPARISON
======================================== */}

      <section className="resume-comparison-section">
        <div className="resume-comparison-header">
          <div>
            <p className="dashboard-label">📊 RESUME COMPARISON</p>

            <h2>
              Resume <span>Improvement</span>
            </h2>

            <p>
              Compare your latest resume with your previous version and see how
              your career scores have changed.
            </p>
          </div>
        </div>

        {!resumeComparison ? (
          <div className="resume-comparison-empty">
            <div className="resume-comparison-empty-icon">📊</div>

            <h3>Comparison will appear here</h3>

            <p>
              Upload and analyze another resume version to compare your
              progress.
            </p>
          </div>
        ) : (
          <div className="resume-comparison-card">
            <div className="resume-comparison-versions">
              <div className="resume-comparison-version">
                <span>Previous Version</span>

                <strong>
                  Version {resumeComparison.previousVersion.version}
                </strong>

                <small>{resumeComparison.previousVersion.filename}</small>
              </div>

              <div className="resume-comparison-arrow">→</div>

              <div className="resume-comparison-version current">
                <span>Current Version</span>

                <strong>
                  Version {resumeComparison.currentVersion.version}
                </strong>

                <small>{resumeComparison.currentVersion.filename}</small>
              </div>
            </div>

            <div className="resume-comparison-metrics">
              {/* JOB MATCH */}

              <div className="resume-comparison-metric">
                <div className="resume-comparison-metric-icon">🎯</div>

                <div className="resume-comparison-metric-info">
                  <span>Job Match</span>

                  <div className="resume-comparison-values">
                    <strong>
                      {resumeComparison.previousVersion.matchScore ?? 0}%
                    </strong>

                    <span>→</span>

                    <strong>
                      {resumeComparison.currentVersion.matchScore ?? 0}%
                    </strong>
                  </div>
                </div>

                <div
                  className={`resume-comparison-change ${
                    resumeComparison.jobMatchChange >= 0
                      ? "positive"
                      : "negative"
                  }`}
                >
                  {resumeComparison.jobMatchChange >= 0 ? "+" : ""}
                  {resumeComparison.jobMatchChange ?? 0}%
                  {resumeComparison.jobMatchChange >= 0 ? " ↑" : " ↓"}
                </div>
              </div>

              {/* ATS */}

              <div className="resume-comparison-metric">
                <div className="resume-comparison-metric-icon">🤖</div>

                <div className="resume-comparison-metric-info">
                  <span>ATS Score</span>

                  <div className="resume-comparison-values">
                    <strong>
                      {resumeComparison.previousVersion.atsScore ?? 0}%
                    </strong>

                    <span>→</span>

                    <strong>
                      {resumeComparison.currentVersion.atsScore ?? 0}%
                    </strong>
                  </div>
                </div>

                <div
                  className={`resume-comparison-change ${
                    resumeComparison.atsChange >= 0 ? "positive" : "negative"
                  }`}
                >
                  {resumeComparison.atsChange >= 0 ? "+" : ""}
                  {resumeComparison.atsChange ?? 0}%
                  {resumeComparison.atsChange >= 0 ? " ↑" : " ↓"}
                </div>
              </div>

              {/* INTERVIEW */}

              <div className="resume-comparison-metric">
                <div className="resume-comparison-metric-icon">🎤</div>

                <div className="resume-comparison-metric-info">
                  <span>Interview</span>

                  <div className="resume-comparison-values">
                    <strong>
                      {resumeComparison.previousVersion.interviewScore ?? 0}%
                    </strong>

                    <span>→</span>

                    <strong>
                      {resumeComparison.currentVersion.interviewScore ?? 0}%
                    </strong>
                  </div>
                </div>

                <div
                  className={`resume-comparison-change ${
                    resumeComparison.interviewChange >= 0
                      ? "positive"
                      : "negative"
                  }`}
                >
                  {resumeComparison.interviewChange >= 0 ? "+" : ""}
                  {resumeComparison.interviewChange ?? 0}%
                  {resumeComparison.interviewChange >= 0 ? " ↑" : " ↓"}
                </div>
              </div>

              {/* JOB READINESS */}

              <div className="resume-comparison-metric">
                <div className="resume-comparison-metric-icon">🚀</div>

                <div className="resume-comparison-metric-info">
                  <span>Job Readiness</span>

                  <div className="resume-comparison-values">
                    <strong>
                      {resumeComparison.previousVersion.jobReadiness ?? 0}%
                    </strong>

                    <span>→</span>

                    <strong>
                      {resumeComparison.currentVersion.jobReadiness ?? 0}%
                    </strong>
                  </div>
                </div>

                <div
                  className={`resume-comparison-change ${
                    resumeComparison.readinessChange >= 0
                      ? "positive"
                      : "negative"
                  }`}
                >
                  {resumeComparison.readinessChange >= 0 ? "+" : ""}
                  {resumeComparison.readinessChange ?? 0}%
                  {resumeComparison.readinessChange >= 0 ? " ↑" : " ↓"}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================
    PHASE 8.2C - RESUME PROGRESS INSIGHTS
======================================== */}

      {resumeProgressInsights && (
        <section className="resume-progress-insights">
          {/* HEADER */}

          <div className="resume-progress-header">
            <div>
              <p className="dashboard-label">📈 PROGRESS INSIGHTS</p>

              <h2>
                Resume <span>Progress Insights</span>
              </h2>

              <p>
                Understand how your latest resume compares with your previous
                version and discover what to focus on next.
              </p>
            </div>
          </div>

          {/* OVERALL PROGRESS */}

          <div
            className={`resume-progress-overall ${resumeProgressInsights.progressStatus}`}
          >
            <div className="resume-progress-overall-icon">
              {resumeProgressInsights.overallChange > 0
                ? "📈"
                : resumeProgressInsights.overallChange < 0
                  ? "📉"
                  : "➡️"}
            </div>

            <div className="resume-progress-overall-content">
              <span className="resume-progress-overall-label">
                OVERALL PROGRESS
              </span>

              <h3>{resumeProgressInsights.progressTitle}</h3>

              <p>{resumeProgressInsights.progressMessage}</p>
            </div>

            <div className="resume-progress-overall-score">
              <strong>
                {resumeProgressInsights.overallChange > 0 ? "+" : ""}
                {resumeProgressInsights.overallChange}
              </strong>

              <span>points</span>
            </div>
          </div>

          {/* HIGHLIGHTS */}

          <div className="resume-progress-highlights">
            {/* BIGGEST IMPROVEMENT */}

            <div className="resume-progress-highlight improvement">
              <div className="resume-progress-highlight-icon">🏆</div>

              <div>
                <span>BIGGEST IMPROVEMENT</span>

                {resumeProgressInsights.biggestImprovement ? (
                  <>
                    <h3>
                      {resumeProgressInsights.biggestImprovement.icon}{" "}
                      {resumeProgressInsights.biggestImprovement.title}
                    </h3>

                    <strong>
                      +{resumeProgressInsights.biggestImprovement.change}%
                    </strong>
                  </>
                ) : (
                  <h3>No significant improvement yet</h3>
                )}
              </div>
            </div>

            {/* BIGGEST DECLINE */}

            <div className="resume-progress-highlight decline">
              <div className="resume-progress-highlight-icon">⚠️</div>

              <div>
                <span>NEEDS ATTENTION</span>

                {resumeProgressInsights.biggestDecline ? (
                  <>
                    <h3>
                      {resumeProgressInsights.biggestDecline.icon}{" "}
                      {resumeProgressInsights.biggestDecline.title}
                    </h3>

                    <strong>
                      {resumeProgressInsights.biggestDecline.change}%
                    </strong>
                  </>
                ) : (
                  <h3>No declining areas 🎉</h3>
                )}
              </div>
            </div>
          </div>

          {/* METRIC BREAKDOWN */}

          <div className="resume-progress-breakdown">
            <div className="resume-progress-breakdown-header">
              <div>
                <span className="dashboard-label">📊 SCORE BREAKDOWN</span>

                <h3>What changed?</h3>
              </div>
            </div>

            <div className="resume-progress-metric-list">
              {resumeProgressInsights.metrics.map((metric) => (
                <div className="resume-progress-metric" key={metric.id}>
                  <div className="resume-progress-metric-icon">
                    {metric.icon}
                  </div>

                  <div className="resume-progress-metric-info">
                    <span>{metric.title}</span>

                    <div className="resume-progress-bar">
                      <div
                        className={`resume-progress-bar-fill ${
                          metric.change >= 0 ? "positive" : "negative"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.abs(metric.change) * 5,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={`resume-progress-metric-change ${
                      metric.change > 0
                        ? "positive"
                        : metric.change < 0
                          ? "negative"
                          : "neutral"
                    }`}
                  >
                    {metric.change > 0
                      ? `+${metric.change}% ↑`
                      : metric.change < 0
                        ? `${metric.change}% ↓`
                        : "0% →"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT STEP RECOMMENDATION */}

          <div className="resume-progress-recommendation">
            <div className="resume-progress-recommendation-icon">💡</div>

            <div>
              <span>RECOMMENDED NEXT STEP</span>

              <h3>Keep improving your resume</h3>

              <p>{resumeProgressInsights.recommendation}</p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
    PHASE 8.4B - CAREER ACTION CENTER
======================================== */}

      {careerActionCenter && (
        <section className="career-action-center">
          {/* HEADER */}

          <div className="career-action-header">
            <div>
              <p className="dashboard-label">🎯 YOUR NEXT MOVE</p>

              <h2>
                Career <span>Action Center</span>
              </h2>

              <p>
                Turn your performance insights into clear, actionable steps for
                your career growth.
              </p>
            </div>
          </div>

          {/* PRIORITY CARD */}

          <div
            className={`career-action-priority career-action-${careerActionCenter.urgency}`}
          >
            <div className="career-action-priority-icon">
              {careerActionCenter.priorityIcon}
            </div>

            <div className="career-action-priority-content">
              <span className="career-action-priority-label">
                {careerActionCenter.priorityLabel}
              </span>

              <h3>{careerActionCenter.title}</h3>

              <p>{careerActionCenter.description}</p>
            </div>

            <div className="career-action-priority-score">
              <small>Current Score</small>

              <strong>{careerActionCenter.priorityScore}%</strong>
            </div>
          </div>

          {/* ACTION AREAS */}

          <div className="career-action-areas">
            <div className="career-action-section-heading">
              <div>
                <p className="dashboard-label">📋 FOCUS AREAS</p>

                <h3>Your Career Priorities</h3>

                <p>
                  Review each area and focus your effort where it can make the
                  biggest difference.
                </p>
              </div>
            </div>

            <div className="career-action-grid">
              {(careerActionCenter.areas || []).map((area) => (
                <div
                  className={`career-action-card ${
                    area.key === careerActionCenter.priority?.key
                      ? "career-action-card-priority"
                      : ""
                  }`}
                  key={area.key}
                >
                  <div className="career-action-card-top">
                    <div className="career-action-card-icon">{area.icon}</div>

                    <span className="career-action-card-score">
                      {area.score}%
                    </span>
                  </div>

                  <h4>{area.label}</h4>

                  <div className="career-action-progress">
                    <div className="career-action-progress-track">
                      <div
                        className="career-action-progress-fill"
                        style={{
                          width: `${Math.min(Math.max(area.score, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p>
                    {area.score < 40
                      ? "High priority — focus on this area first."
                      : area.score < 60
                        ? "Needs attention — targeted practice can help."
                        : area.score < 75
                          ? "Good foundation — continue improving."
                          : "Strong performance — keep maintaining it."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDED ACTION */}

          <div className="career-action-recommendation">
            <div className="career-action-recommendation-icon">💡</div>

            <div>
              <span>RECOMMENDED NEXT STEP</span>

              <h3>{careerActionCenter.actionLabel}</h3>

              <p>
                Start by improving your{" "}
                <strong>
                  {careerActionCenter.priority?.label ||
                    "lowest-performing area"}
                </strong>
                . Consistent targeted practice will help improve your overall
                career readiness.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
    PHASE 8.5B - PERSONAL CAREER ROADMAP
======================================== */}

      <section className="career-roadmap-section">
        {/* ========================================
      ROADMAP HEADER
  ======================================== */}

        <div className="career-roadmap-header">
          <div>
            <p className="dashboard-label">🗺️ CAREER ROADMAP</p>

            <h2>
              Your Personalized <span>Career Roadmap</span>
            </h2>

            <p>
              Follow a step-by-step plan based on your current performance,
              strengths, and areas that need improvement.
            </p>
          </div>

          <div className="career-roadmap-role">
            <span>🎯 Target Role</span>

            <strong>{careerRoadmap.targetRole || "Your Target Role"}</strong>
          </div>
        </div>

        {/* ========================================
      CURRENT GOAL
  ======================================== */}

        <div className="career-roadmap-goal">
          <div className="career-roadmap-goal-icon">🎯</div>

          <div className="career-roadmap-goal-content">
            <span className="career-roadmap-eyebrow">CURRENT GOAL</span>

            <h3>
              {careerRoadmap.currentGoal ||
                "Complete your first career assessment"}
            </h3>

            <p>
              {careerRoadmap.goalDescription ||
                "Complete an assessment to start building your personalized career roadmap."}
            </p>
          </div>

          <div
            className={`career-roadmap-priority career-roadmap-priority-${String(
              careerRoadmap.priority || "normal",
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <span>Priority</span>

            <strong>{careerRoadmap.priority || "Getting Started"}</strong>

            {careerRoadmap.priorityScore > 0 && (
              <small>{careerRoadmap.priorityScore}%</small>
            )}
          </div>
        </div>

        {/* ========================================
      PROGRESS SUMMARY
  ======================================== */}

        <div className="career-roadmap-summary">
          <div className="career-roadmap-summary-card">
            <span className="career-roadmap-summary-icon">📊</span>

            <div>
              <small>Current Score</small>

              <strong>{careerRoadmap.currentScore ?? 0}%</strong>
            </div>
          </div>

          <div className="career-roadmap-summary-card">
            <span className="career-roadmap-summary-icon">🏆</span>

            <div>
              <small>Personal Best</small>

              <strong>{careerRoadmap.bestScore ?? 0}%</strong>
            </div>
          </div>

          <div className="career-roadmap-summary-card">
            <span className="career-roadmap-summary-icon">📈</span>

            <div>
              <small>Overall Progress</small>

              <strong>{careerRoadmap.overallProgress ?? 0}%</strong>
            </div>
          </div>

          <div className="career-roadmap-summary-card">
            <span className="career-roadmap-summary-icon">🔄</span>

            <div>
              <small>Score Change</small>

              <strong
                className={
                  careerRoadmap.improvement > 0
                    ? "roadmap-positive"
                    : careerRoadmap.improvement < 0
                      ? "roadmap-negative"
                      : ""
                }
              >
                {careerRoadmap.improvement > 0 ? "+" : ""}
                {careerRoadmap.improvement ?? 0}%
              </strong>
            </div>
          </div>
        </div>

        {/* ========================================
      ROADMAP TIMELINE
  ======================================== */}

        <div className="career-roadmap-container">
          <div className="career-roadmap-section-heading">
            <div>
              <p className="dashboard-label">🧭 YOUR JOURNEY</p>

              <h3>Career Growth Roadmap</h3>

              <p>
                Complete each milestone to keep moving toward stronger career
                readiness.
              </p>
            </div>
          </div>

          <div className="career-roadmap-timeline">
            {(careerRoadmap.milestones || []).map((milestone, index) => {
              const isCompleted = milestone.status === "completed";

              const isCurrent = milestone.status === "current";

              const isUpcoming = milestone.status === "upcoming";

              return (
                <div
                  className={`career-roadmap-milestone career-roadmap-milestone-${milestone.status || "upcoming"}`}
                  key={milestone.id || index}
                >
                  {/* Timeline line */}

                  {index < careerRoadmap.milestones.length - 1 && (
                    <div className="career-roadmap-line" />
                  )}

                  {/* Timeline node */}

                  <div className="career-roadmap-node">
                    <span>
                      {milestone.icon ||
                        (isCompleted ? "✓" : isCurrent ? "🎯" : "○")}
                    </span>
                  </div>

                  {/* Milestone content */}

                  <div className="career-roadmap-milestone-content">
                    <div className="career-roadmap-milestone-top">
                      <div>
                        <span className="career-roadmap-step">
                          STEP {index + 1}
                        </span>

                        <h4>{milestone.title}</h4>
                      </div>

                      <span className="career-roadmap-status">
                        {isCompleted
                          ? "✓ Completed"
                          : isCurrent
                            ? "● Current"
                            : "○ Upcoming"}
                      </span>
                    </div>

                    <p>{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
      ROADMAP FOOTER
  ======================================== */}

        <div className="career-roadmap-footer">
          <div className="career-roadmap-footer-icon">💡</div>

          <div>
            <span>KEEP MOVING FORWARD</span>

            <h3>Small improvements create long-term career growth.</h3>

            <p>
              Focus on your current milestone first. Once you complete it, your
              next career priority will become clearer.
            </p>
          </div>
        </div>
      </section>

      {/* ================================
          CAREER READINESS DASHBOARD
      ================================= */}

      {analysis && (
        <div className="career-dashboard">
          <div className="dashboard-header">
            <div>
              <p className="dashboard-label">🎯 AI CAREER DASHBOARD</p>
              <h2>Your Job Readiness</h2>
              <p>
                A combined view of your resume match, ATS compatibility, and
                mock interview performance.
              </p>
            </div>

            <button
              className="dashboard-refresh-button"
              onClick={() => generateJobReadiness()}
              disabled={jobReadinessLoading}
            >
              {jobReadinessLoading
                ? "🤖 Calculating..."
                : "📊 Refresh Dashboard"}
            </button>
          </div>

          {jobReadinessError && (
            <div className="error-message">{jobReadinessError}</div>
          )}

          {jobReadiness && (
            <>
              <div className="dashboard-readiness-card">
                <div>
                  <span className="dashboard-readiness-label">
                    JOB READINESS
                  </span>
                  <strong>{jobReadiness.job_readiness}%</strong>
                  <p>
                    {jobReadiness.interview_pending
                      ? "Resume analysis is ready. Complete the mock interview for the full readiness score."
                      : jobReadiness.job_readiness >= 80
                        ? "Excellent progress — you are showing strong job readiness."
                        : jobReadiness.job_readiness >= 60
                          ? "Good progress — a few focused improvements can make you stronger."
                          : "Keep building your resume alignment and interview performance."}
                  </p>
                </div>

                <div
                  className="dashboard-score-ring"
                  style={{
                    "--dashboard-score": `${jobReadiness.job_readiness}%`,
                  }}
                >
                  <div>
                    <strong>{jobReadiness.job_readiness}%</strong>
                    <span>Ready</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-metrics">
                <div className="dashboard-metric-card">
                  <span>📄</span>
                  <p>Resume Match</p>
                  <strong>{jobReadiness.match_score}%</strong>
                </div>

                <div className="dashboard-metric-card">
                  <span>🤖</span>
                  <p>ATS Score</p>
                  <strong>{jobReadiness.ats_score}%</strong>
                </div>

                <div className="dashboard-metric-card">
                  <span>🎤</span>
                  <p>Interview</p>
                  <strong>
                    {jobReadiness.interview_score !== null
                      ? `${jobReadiness.interview_score}%`
                      : "Pending"}
                  </strong>
                </div>

                <div className="dashboard-metric-card">
                  <span>💬</span>
                  <p>Communication</p>
                  <strong>
                    {jobReadiness.communication_score !== null
                      ? `${jobReadiness.communication_score}%`
                      : "Pending"}
                  </strong>
                </div>
              </div>

              <div className="dashboard-bottom-grid">
                <div className="dashboard-panel">
                  <div className="dashboard-panel-title">
                    <span>📈</span>
                    <div>
                      <h3>Progress Snapshot</h3>
                      <p>Your current performance indicators.</p>
                    </div>
                  </div>

                  <div className="dashboard-progress-list">
                    <div>
                      <span>Job Match</span>
                      <strong>{jobReadiness.match_score}%</strong>
                      <div className="dashboard-progress">
                        <div
                          style={{ width: `${jobReadiness.match_score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <span>ATS Compatibility</span>
                      <strong>{jobReadiness.ats_score}%</strong>
                      <div className="dashboard-progress">
                        <div style={{ width: `${jobReadiness.ats_score}%` }} />
                      </div>
                    </div>

                    <div>
                      <span>Interview Performance</span>
                      <strong>
                        {jobReadiness.interview_score !== null
                          ? `${jobReadiness.interview_score}%`
                          : "Pending"}
                      </strong>
                      <div className="dashboard-progress">
                        <div
                          style={{
                            width: `${jobReadiness.interview_score ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel">
                  <div className="dashboard-panel-title">
                    <span>🎯</span>
                    <div>
                      <h3>Recommended Next Steps</h3>
                      <p>Focus on the areas with the biggest impact.</p>
                    </div>
                  </div>

                  <div className="dashboard-recommendations">
                    {jobReadiness.recommendations?.map((item, index) => (
                      <div key={index}>
                        <span>{index + 1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-actions">
                <button
                  className="dashboard-action-button"
                  onClick={() =>
                    document
                      .querySelector(".ats-results")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  📊 Review ATS Score
                </button>

                <button
                  className="dashboard-action-button"
                  onClick={() =>
                    document
                      .querySelector(".resume-coach")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  ✨ Improve Resume
                </button>

                <button
                  className="dashboard-action-button"
                  onClick={() =>
                    document
                      .querySelector(".mock-interview-container")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  🎤 Practice Interview
                </button>
              </div>

              {historyLoaded && (
                <div className="dashboard-history">
                  {/* HISTORY HEADER */}
                  <div className="dashboard-history-header">
                    <div>
                      <div className="dashboard-panel-title">
                        <span>📈</span>
                        <div>
                          <h3>Career Progress History</h3>
                          <p>
                            Your completed mock-interview attempts are saved in
                            this browser.
                          </p>
                        </div>
                      </div>
                    </div>

                    {careerHistory.length > 0 && (
                      <button
                        className="dashboard-clear-history"
                        onClick={clearCareerHistory}
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {careerHistory.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="dashboard-history-empty">
                      <span>🗂️</span>

                      <div>
                        <strong>Your progress history will appear here.</strong>

                        <p>
                          Complete another mock interview to compare your
                          performance over time.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* SUMMARY CARDS */}
                      <div className="dashboard-history-summary">
                        <div>
                          <span>Attempts</span>
                          <strong>{careerHistory.length}</strong>
                        </div>

                        <div>
                          <span>Best Readiness</span>
                          <strong>
                            {Math.max(
                              ...careerHistory.map(
                                (attempt) => attempt.jobReadiness || 0,
                              ),
                            )}
                            %
                          </strong>
                        </div>

                        <div>
                          <span>Latest</span>
                          <strong>{careerHistory[0].jobReadiness || 0}%</strong>
                        </div>

                        <div>
                          <span>Change</span>

                          <strong
                            className={
                              careerHistory.length > 1 &&
                              careerHistory[0].jobReadiness >=
                                careerHistory[1].jobReadiness
                                ? "history-positive"
                                : "history-negative"
                            }
                          >
                            {careerHistory.length > 1
                              ? `${
                                  careerHistory[0].jobReadiness -
                                    careerHistory[1].jobReadiness >=
                                  0
                                    ? "+"
                                    : ""
                                }${
                                  careerHistory[0].jobReadiness -
                                  careerHistory[1].jobReadiness
                                }%`
                              : "—"}
                          </strong>
                        </div>
                      </div>

                      {/* PERFORMANCE CHART */}
                      <div className="dashboard-history-chart">
                        {careerHistory
                          .slice()
                          .reverse()
                          .map((attempt, index) => (
                            <div
                              className="history-chart-column"
                              key={attempt.id}
                            >
                              <div className="history-chart-value">
                                {attempt.jobReadiness || 0}%
                              </div>

                              <div className="history-chart-track">
                                <div
                                  className="history-chart-bar"
                                  style={{
                                    height: `${Math.max(
                                      8,
                                      attempt.jobReadiness || 0,
                                    )}%`,
                                  }}
                                />
                              </div>

                              <span>Attempt {index + 1}</span>
                            </div>
                          ))}
                      </div>

                      {/* PERFORMANCE TABLE */}
                      <div className="dashboard-history-table">
                        <div className="history-table-row history-table-heading">
                          <span>Date</span>
                          <span>Readiness</span>
                          <span>Resume</span>
                          <span>ATS</span>
                          <span>Interview</span>
                          <span>Communication</span>
                          <span>Relevance</span>
                        </div>

                        {careerHistory.map((attempt) => (
                          <div className="history-table-row" key={attempt.id}>
                            <span>
                              {new Date(attempt.date).toLocaleDateString(
                                undefined,
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>

                            <strong>{attempt.jobReadiness ?? 0}%</strong>

                            <span>{attempt.matchScore ?? 0}%</span>

                            <span>{attempt.atsScore ?? 0}%</span>

                            <span>{attempt.interviewScore ?? 0}%</span>

                            <span>{attempt.communicationScore ?? 0}%</span>

                            <span>{attempt.relevanceScore ?? 0}%</span>
                          </div>
                        ))}
                      </div>

                      {/* PERFORMANCE INSIGHTS */}
                      <div className="history-insights">
                        <div className="history-insight-card">
                          <span>🏆</span>

                          <div>
                            <strong>Best Performance</strong>

                            <p>
                              Your highest job-readiness score is{" "}
                              {Math.max(
                                ...careerHistory.map(
                                  (attempt) => attempt.jobReadiness || 0,
                                ),
                              )}
                              %.
                            </p>
                          </div>
                        </div>

                        <div className="history-insight-card">
                          <span>🎤</span>

                          <div>
                            <strong>Interview Performance</strong>

                            <p>
                              Latest interview score:{" "}
                              {careerHistory[0].interviewScore ?? 0}%.
                            </p>
                          </div>
                        </div>

                        <div className="history-insight-card">
                          <span>💬</span>

                          <div>
                            <strong>Communication</strong>

                            <p>
                              Latest communication score:{" "}
                              {careerHistory[0].communicationScore ?? 0}%.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CAREER ANALYTICS */}
                      <div className="career-analytics-section">
                        <div className="career-analytics-heading">
                          <div>
                            <p className="dashboard-label">🤖 AI INSIGHTS</p>
                            <h3>Career Analytics</h3>
                            <p>
                              Understand your strongest areas and where to focus
                              next.
                            </p>
                          </div>

                          <div
                            className={`analytics-trend analytics-trend-${careerAnalytics.trendType}`}
                          >
                            <span>
                              {careerAnalytics.trendType === "positive"
                                ? "📈"
                                : careerAnalytics.trendType === "negative"
                                  ? "📉"
                                  : "📊"}
                            </span>
                            <p>{careerAnalytics.trendText}</p>
                          </div>
                        </div>

                        {/* ========================================
    PHASE 8.3B - CAREER SCORE SUMMARY
======================================== */}

                        <div className="career-score-summary">
                          <div className="career-score-card">
                            <span className="career-score-icon">📊</span>

                            <div>
                              <small>Current Score</small>

                              <strong>{careerAnalytics.currentScore}%</strong>
                            </div>
                          </div>

                          <div className="career-score-card">
                            <span className="career-score-icon">📈</span>

                            <div>
                              <small>Average Score</small>

                              <strong>{careerAnalytics.averageScore}%</strong>
                            </div>
                          </div>

                          <div className="career-score-card">
                            <span className="career-score-icon">🏆</span>

                            <div>
                              <small>Best Score</small>

                              <strong>{careerAnalytics.bestScore}%</strong>
                            </div>
                          </div>

                          <div
                            className={`career-score-card ${
                              careerAnalytics.scoreChange > 0
                                ? "score-positive"
                                : careerAnalytics.scoreChange < 0
                                  ? "score-negative"
                                  : "score-neutral"
                            }`}
                          >
                            <span className="career-score-icon">
                              {careerAnalytics.scoreChange > 0
                                ? "⬆️"
                                : careerAnalytics.scoreChange < 0
                                  ? "⬇️"
                                  : "➡️"}
                            </span>

                            <div>
                              <small>Latest Change</small>

                              <strong>
                                {careerAnalytics.scoreChange > 0
                                  ? `+${careerAnalytics.scoreChange}%`
                                  : `${careerAnalytics.scoreChange}%`}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="analytics-metrics-grid">
                          <div className="analytics-metric-card">
                            <span className="analytics-metric-icon">🏆</span>
                            <div>
                              <p>Strongest Area</p>
                              <h4>{careerAnalytics.strongest?.label || "—"}</h4>
                              <strong>
                                {careerAnalytics.strongest?.value ?? 0}%
                              </strong>
                            </div>
                          </div>

                          <div className="analytics-metric-card analytics-needs-work">
                            <span className="analytics-metric-icon">🎯</span>
                            <div>
                              <p>Focus Area</p>
                              <h4>{careerAnalytics.weakest?.label || "—"}</h4>
                              <strong>
                                {careerAnalytics.weakest?.value ?? 0}%
                              </strong>
                            </div>
                          </div>

                          <div className="analytics-metric-card">
                            <span className="analytics-metric-icon">🥇</span>
                            <div>
                              <p>Best Readiness</p>
                              <h4>Personal Best</h4>
                              <strong>{careerAnalytics.bestReadiness}%</strong>
                            </div>
                          </div>

                          <div className="analytics-metric-card">
                            <span className="analytics-metric-icon">🎤</span>
                            <div>
                              <p>Best Interview</p>
                              <h4>Personal Best</h4>
                              <strong>{careerAnalytics.bestInterview}%</strong>
                            </div>
                          </div>
                        </div>

                        <div className="analytics-performance-panel">
                          <div className="analytics-performance-header">
                            <div>
                              <h4>Latest Performance Breakdown</h4>
                              <p>
                                Your latest saved mock-interview attempt across
                                all key metrics.
                              </p>
                            </div>
                            <strong>
                              {careerHistory[0].jobReadiness ?? 0}% Readiness
                            </strong>
                          </div>

                          <div className="analytics-progress-list">
                            {[
                              [
                                "Resume Match",
                                careerHistory[0].matchScore ?? 0,
                              ],
                              [
                                "ATS Compatibility",
                                careerHistory[0].atsScore ?? 0,
                              ],
                              [
                                "Interview",
                                careerHistory[0].interviewScore ?? 0,
                              ],
                              [
                                "Communication",
                                careerHistory[0].communicationScore ?? 0,
                              ],
                              [
                                "Answer Relevance",
                                careerHistory[0].relevanceScore ?? 0,
                              ],
                              [
                                "Job Readiness",
                                careerHistory[0].jobReadiness ?? 0,
                              ],
                            ].map(([label, value]) => (
                              <div
                                className="analytics-progress-item"
                                key={label}
                              >
                                <div className="analytics-progress-label">
                                  <span>{label}</span>
                                  <strong>{value}%</strong>
                                </div>
                                <div className="analytics-progress-track">
                                  <div
                                    className="analytics-progress-fill"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ========================================
    PHASE 8.3C - CAREER PROGRESS TREND
======================================== */}

                        <div className="career-progress-panel">
                          <div className="career-progress-header">
                            <div>
                              <p className="dashboard-label">
                                📈 PROGRESS TREND
                              </p>

                              <h4>Career Progress</h4>

                              <p>
                                Track how your overall career score changes
                                across your saved attempts.
                              </p>
                            </div>

                            {careerAnalytics.trendData?.length > 1 && (
                              <div
                                className={`career-progress-status career-progress-status-${careerAnalytics.trendType}`}
                              >
                                <span>
                                  {careerAnalytics.trendType === "positive"
                                    ? "📈"
                                    : careerAnalytics.trendType === "negative"
                                      ? "📉"
                                      : "📊"}
                                </span>

                                <strong>
                                  {careerAnalytics.scoreChange > 0
                                    ? `+${careerAnalytics.scoreChange}%`
                                    : `${careerAnalytics.scoreChange}%`}
                                </strong>
                              </div>
                            )}
                          </div>

                          {careerAnalytics.trendData?.length > 1 ? (
                            <div className="career-progress-chart">
                              <div className="career-progress-y-axis">
                                <span>100%</span>
                                <span>75%</span>
                                <span>50%</span>
                                <span>25%</span>
                                <span>0%</span>
                              </div>

                              <div className="career-progress-chart-area">
                                <div className="career-progress-grid">
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                </div>

                                <div className="career-progress-bars">
                                  {careerAnalytics.trendData.map(
                                    (point, index) => (
                                      <div
                                        className="career-progress-point"
                                        key={`${point.id || index}-${index}`}
                                      >
                                        <div
                                          className="career-progress-bar"
                                          style={{
                                            height: `${Math.max(
                                              8,
                                              Math.min(100, point.score || 0),
                                            )}%`,
                                          }}
                                        >
                                          <span className="career-progress-value">
                                            {point.score}%
                                          </span>
                                        </div>

                                        <span className="career-progress-label">
                                          Attempt {index + 1}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="career-progress-empty">
                              <span>📊</span>

                              <h4>Not enough data yet</h4>

                              <p>
                                Complete another practice attempt to start
                                building your career progress trend.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="analytics-action-card">
                          <span>💡</span>
                          <div>
                            <strong>
                              Recommended Focus:{" "}
                              {careerAnalytics.weakest?.label ||
                                "Interview Practice"}
                            </strong>
                            <p>
                              Your lowest current score is{" "}
                              {careerAnalytics.weakest?.value ?? 0}%. Focus your
                              next practice session on this area to improve your
                              overall readiness.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ================================
            PHASE 7.2A - CAREER ROADMAP
        ================================= */}

                      <div className="career-roadmap-section">
                        <div className="career-roadmap-header">
                          <div>
                            <p className="dashboard-label">🧭 CAREER ROADMAP</p>

                            <h3>
                              Your Path to{" "}
                              <span>{careerRoadmap.targetRole}</span>
                            </h3>

                            <p>
                              Based on your latest performance, here is where
                              you stand and what you should focus on next.
                            </p>
                          </div>
                        </div>

                        <div className="career-roadmap-grid">
                          {careerRoadmap.items.map((item) => (
                            <div className="career-roadmap-card" key={item.id}>
                              <div className="career-roadmap-card-top">
                                <span className="career-roadmap-icon">
                                  {item.icon}
                                </span>

                                <div>
                                  <h4>{item.title}</h4>

                                  <strong>
                                    {item.score !== null
                                      ? `${item.score}%`
                                      : "Pending"}
                                  </strong>
                                </div>
                              </div>

                              <div className="career-roadmap-progress">
                                <div
                                  style={{
                                    width: `${item.score ?? 0}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="career-roadmap-insights">
                          <div className="career-roadmap-insight strongest">
                            <span>🏆</span>

                            <div>
                              <strong>Your Strongest Area</strong>

                              <p>
                                {careerRoadmap.strongest
                                  ? `${careerRoadmap.strongest.title} — ${careerRoadmap.strongest.score}%`
                                  : "Complete a mock interview to identify your strongest area."}
                              </p>
                            </div>
                          </div>

                          <div className="career-roadmap-insight weakest">
                            <span>🎯</span>

                            <div>
                              <strong>Focus Area</strong>

                              <p>
                                {careerRoadmap.weakest
                                  ? `${careerRoadmap.weakest.title} — ${careerRoadmap.weakest.score}%`
                                  : "Complete a mock interview to identify where you should focus next."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* =========================================
    PHASE 7.2B.2 - IMPROVEMENT PLAN
========================================= */}

                      {careerActionPlan.focus && careerActionPlan.plan && (
                        <section className="career-action-plan">
                          <div className="career-action-plan-header">
                            <div className="career-action-plan-icon">🚀</div>

                            <div>
                              <p className="career-action-plan-label">
                                IMPROVEMENT PLAN
                              </p>

                              <h2>
                                Improve Your{" "}
                                <span>{careerActionPlan.focus.title}</span>
                              </h2>

                              <p className="career-action-plan-subtitle">
                                A practical plan based on your current
                                performance.
                              </p>
                            </div>
                          </div>

                          <div className="career-action-plan-score">
                            <div className="career-action-score-card">
                              <span>Current Score</span>
                              <strong>{careerActionPlan.currentScore}%</strong>
                            </div>

                            <div className="career-action-arrow">→</div>

                            <div className="career-action-score-card career-action-target">
                              <span>Target Score</span>
                              <strong>{careerActionPlan.targetScore}%</strong>
                            </div>
                          </div>

                          <div className="career-action-plan-why">
                            <h3>💡 Why this matters</h3>
                            <p>{careerActionPlan.plan.why}</p>
                          </div>

                          <div className="career-action-plan-actions">
                            <h3>🎯 Recommended Actions</h3>

                            <div className="career-action-list">
                              {careerActionPlan.plan.actions.map(
                                (action, index) => (
                                  <div
                                    className="career-action-item"
                                    key={index}
                                  >
                                    <span className="career-action-number">
                                      {index + 1}
                                    </span>

                                    <p>{action}</p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                      {/* ========================================
    PHASE 7.3B - PERSONALIZED PRACTICE GOALS
======================================== */}

                      <div className="practice-goals-section">
                        <div className="practice-goals-header">
                          <div>
                            <p className="dashboard-label">
                              🎯 PERSONALIZED PRACTICE
                            </p>

                            <h2>
                              Practice for{" "}
                              <span>
                                {practiceGoal.plan?.goal || "Your Career Goal"}
                              </span>
                            </h2>

                            <p>
                              Build your skills through focused practice based
                              on your current performance.
                            </p>
                          </div>
                        </div>

                        <div className="practice-goal-score-row">
                          <div className="practice-score-card">
                            <small>Current Score</small>

                            <strong>{practiceGoal.currentScore ?? 0}%</strong>
                          </div>

                          <div className="practice-score-arrow">→</div>

                          <div className="practice-score-card practice-score-target">
                            <small>Target Score</small>

                            <strong>{practiceGoal.targetScore ?? 60}%</strong>
                          </div>
                        </div>

                        <div className="practice-goal-content">
                          <div className="practice-goal-heading">
                            <span>📚</span>

                            <div>
                              <h3>This Week's Practice</h3>

                              <p>
                                Complete these activities to improve your
                                {practiceGoal.focus?.title
                                  ? ` ${practiceGoal.focus.title.toLowerCase()}`
                                  : " overall performance"}
                                .
                              </p>
                            </div>
                          </div>

                          <div className="practice-activities">
                            {practiceGoal.plan?.activities?.map(
                              (activity, index) => {
                                const isCompleted =
                                  completedPractice.includes(index);

                                return (
                                  <div
                                    className={`practice-activity-card ${
                                      isCompleted ? "completed" : ""
                                    }`}
                                    key={index}
                                    onClick={() =>
                                      togglePracticeActivity(index)
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                      if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                      ) {
                                        event.preventDefault();
                                        togglePracticeActivity(index);
                                      }
                                    }}
                                  >
                                    <div
                                      className={`practice-activity-checkbox ${
                                        isCompleted ? "checked" : ""
                                      }`}
                                    >
                                      {isCompleted ? "✓" : ""}
                                    </div>

                                    <div className="practice-activity-number">
                                      {index + 1}
                                    </div>

                                    <div className="practice-activity-text">
                                      <strong>
                                        Practice Activity {index + 1}
                                      </strong>

                                      <p>{activity}</p>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>

                          <div className="practice-progress-section">
                            <div className="practice-progress-header">
                              <div>
                                <strong>Practice Progress</strong>

                                <p>
                                  {completedCount} of{" "}
                                  {practiceGoal.weeklyTarget} sessions completed
                                </p>
                              </div>

                              <span>{practiceProgress}%</span>
                            </div>

                            <div className="practice-progress-bar">
                              <div
                                style={{
                                  width: `${practiceProgress}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="practice-weekly-target">
                            <span>🎯</span>

                            <div>
                              <strong>Weekly Practice Target</strong>

                              <p>
                                Complete {practiceGoal.weeklyTarget} practice
                                sessions this week.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

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

                  <p>{renderFormattedText(item)}</p>
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

                  <p>{renderFormattedText(item)}</p>
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
                disabled={mockInterviewLoading || !mockEvaluation}
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

              <div className="summary-text">
                {renderFormattedText(improvementSections.summary)}
              </div>
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

                    <p>{renderFormattedText(item)}</p>
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
                    {renderFormattedText(keyword)}
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

                    <p>{renderFormattedText(item)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* ========================================
          PHASE 9.2A - JOB APPLICATION TRACKER
      ======================================== */}

      <section className="job-tracker-section">
        <div className="job-tracker-header">
          <div>
            <p className="dashboard-label">💼 JOB TRACKER</p>

            <h2>
              Track Your <span>Job Applications</span>
            </h2>

            <p>
              Keep your applications organized and stay on top of your career
              opportunities.
            </p>
          </div>
        </div>

        {/* ================================
            JOB APPLICATION FORM
        ================================= */}

        <form className="job-tracker-form" onSubmit={addJobApplication}>
          <div className="job-tracker-form-grid">
            {/* COMPANY */}

            <div className="job-tracker-field">
              <label>Company Name</label>

              <input
                type="text"
                value={jobApplicationForm.company}
                onChange={(event) =>
                  updateJobApplicationField("company", event.target.value)
                }
                placeholder="e.g. Infosys"
              />
            </div>

            {/* ROLE */}

            <div className="job-tracker-field">
              <label>Job Role</label>

              <input
                type="text"
                value={jobApplicationForm.role}
                onChange={(event) =>
                  updateJobApplicationField("role", event.target.value)
                }
                placeholder="e.g. Python Developer"
              />
            </div>

            {/* APPLICATION DATE */}

            <div className="job-tracker-field">
              <label>Application Date</label>

              <input
                type="date"
                value={jobApplicationForm.applicationDate}
                onChange={(event) =>
                  updateJobApplicationField(
                    "applicationDate",
                    event.target.value,
                  )
                }
              />
            </div>

            {/* STATUS */}

            <div className="job-tracker-field">
              <label>Status</label>

              <select
                value={jobApplicationForm.status}
                onChange={(event) =>
                  updateJobApplicationField("status", event.target.value)
                }
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* JOB LINK */}

            <div className="job-tracker-field job-tracker-field-wide">
              <label>
                Job Link <span>(optional)</span>
              </label>

              <input
                type="url"
                value={jobApplicationForm.jobLink}
                onChange={(event) =>
                  updateJobApplicationField("jobLink", event.target.value)
                }
                placeholder="https://company.com/job"
              />
            </div>

            {/* NOTES */}

            <div className="job-tracker-field job-tracker-field-wide">
              <label>
                Notes <span>(optional)</span>
              </label>

              <textarea
                value={jobApplicationForm.notes}
                onChange={(event) =>
                  updateJobApplicationField("notes", event.target.value)
                }
                placeholder="Add any notes about this application..."
                rows="4"
              />
            </div>
          </div>

          {jobTrackerMessage && (
            <div className="job-tracker-message">{jobTrackerMessage}</div>
          )}

          <div className="job-tracker-form-actions">
            {editingJobApplicationId !== null && (
              <button
                type="button"
                className="job-tracker-cancel-button"
                onClick={cancelJobApplicationEdit}
              >
                ✕ Cancel Edit
              </button>
            )}

            <button type="submit" className="job-tracker-add-button">
              {editingJobApplicationId !== null
                ? "✏️ Update Application"
                : "➕ Add Application"}
            </button>
          </div>
        </form>

        {/* ================================
            PHASE 9.2D - JOB TRACKER STATISTICS
        ================================= */}

        <div className="job-tracker-stats-section">
          <div className="job-tracker-stats-heading">
            <div>
              <p className="dashboard-label">📊 APPLICATION INSIGHTS</p>

              <h3>Your Application Overview</h3>

              <p>Get a quick snapshot of where your job applications stand.</p>
            </div>
          </div>

          <div className="job-tracker-stats-grid">
            <div className="job-tracker-stat-card stat-total">
              <div className="job-tracker-stat-icon">📋</div>
              <div>
                <span>Total Applications</span>
                <strong>{jobTrackerStats.total}</strong>
              </div>
            </div>

            <div className="job-tracker-stat-card stat-applied">
              <div className="job-tracker-stat-icon">📨</div>
              <div>
                <span>Applied</span>
                <strong>{jobTrackerStats.applied}</strong>
              </div>
            </div>

            <div className="job-tracker-stat-card stat-shortlisted">
              <div className="job-tracker-stat-icon">⭐</div>
              <div>
                <span>Shortlisted</span>
                <strong>{jobTrackerStats.shortlisted}</strong>
              </div>
            </div>

            <div className="job-tracker-stat-card stat-interview">
              <div className="job-tracker-stat-icon">🎤</div>
              <div>
                <span>Interviews</span>
                <strong>{jobTrackerStats.interview}</strong>
              </div>
            </div>

            <div className="job-tracker-stat-card stat-offer">
              <div className="job-tracker-stat-icon">🎉</div>
              <div>
                <span>Offers</span>
                <strong>{jobTrackerStats.offer}</strong>
              </div>
            </div>

            <div className="job-tracker-stat-card stat-rejected">
              <div className="job-tracker-stat-icon">↩️</div>
              <div>
                <span>Rejected</span>
                <strong>{jobTrackerStats.rejected}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================================
            PHASE 9.2E - SEARCH & FILTER
        ================================= */}

        {jobApplications.length > 0 && (
          <div className="job-tracker-search-section">
            <div className="job-tracker-search-heading">
              <div>
                <p className="dashboard-label">🔎 FIND AN APPLICATION</p>
                <h3>Search & Filter</h3>
                <p>Quickly find applications by company, role, or status.</p>
              </div>

              {(jobApplicationSearch ||
                jobApplicationStatusFilter !== "All") && (
                <button
                  type="button"
                  className="job-tracker-clear-filter-button"
                  onClick={clearJobApplicationFilters}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            <div className="job-tracker-search-controls">
              <div className="job-tracker-search-field">
                <label htmlFor="job-application-search">Search</label>
                <div className="job-tracker-search-input-wrap">
                  <span>🔎</span>
                  <input
                    id="job-application-search"
                    type="search"
                    value={jobApplicationSearch}
                    onChange={(event) =>
                      setJobApplicationSearch(event.target.value)
                    }
                    placeholder="Search by company or job role..."
                  />
                </div>
              </div>

              <div className="job-tracker-search-field">
                <label htmlFor="job-application-status-filter">Status</label>
                <select
                  id="job-application-status-filter"
                  value={jobApplicationStatusFilter}
                  onChange={(event) =>
                    setJobApplicationStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="job-tracker-filter-summary">
              Showing <strong>{filteredJobApplications.length}</strong> of
              <strong>{jobApplications.length}</strong> applications
            </div>
          </div>
        )}

        {/* ================================
            APPLICATION LIST
        ================================= */}

        <div className="job-tracker-applications">
          <div className="job-tracker-list-header">
            <div>
              <h3>Your Applications</h3>

              <p>
                {jobApplications.length === 0
                  ? "Your saved applications will appear here."
                  : `${filteredJobApplications.length} application${
                      filteredJobApplications.length === 1 ? "" : "s"
                    } shown`}
              </p>
            </div>
          </div>

          {jobApplications.length === 0 ? (
            <div className="job-tracker-empty">
              <div className="job-tracker-empty-icon">💼</div>

              <h3>No applications tracked yet</h3>

              <p>
                Add your first job application above to start building your
                personal application tracker.
              </p>
            </div>
          ) : filteredJobApplications.length === 0 ? (
            <div className="job-tracker-no-results">
              <div className="job-tracker-no-results-icon">🔎</div>
              <h3>No matching applications</h3>
              <p>Try a different company, job role, or status filter.</p>
              <button
                type="button"
                className="job-tracker-clear-filter-button"
                onClick={clearJobApplicationFilters}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="job-tracker-list">
              {filteredJobApplications.map((application) => (
                <div className="job-application-card" key={application.id}>
                  <div className="job-application-card-header">
                    <div className="job-application-company">
                      <div className="job-application-company-icon">🏢</div>

                      <div>
                        <h3>{application.company}</h3>

                        <p>{application.role}</p>
                      </div>
                    </div>

                    <div className="job-application-header-actions">
                      <span
                        className={`job-application-status status-${application.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {application.status}
                      </span>

                      <button
                        type="button"
                        className="job-application-edit-button"
                        onClick={() => editJobApplication(application)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="job-application-delete-button"
                        onClick={() => deleteJobApplication(application)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div className="job-application-details">
                    <div>
                      <span>📅 Applied</span>

                      <strong>
                        {new Date(
                          `${application.applicationDate}T00:00:00`,
                        ).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>

                    {application.jobLink && (
                      <div>
                        <span>🔗 Job Link</span>

                        <a
                          href={application.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Job
                        </a>
                      </div>
                    )}
                  </div>

                  {application.notes && (
                    <div className="job-application-notes">
                      <span>📝 Notes</span>

                      <p>{application.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default CareerAnalyzer;
