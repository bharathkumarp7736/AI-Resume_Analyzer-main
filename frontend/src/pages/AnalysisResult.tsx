import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react";

type ResumeAnalysis = {
  atsScore: number;
  summary: string;
  strongPoints: string[];
  weakPoints: string[];
  missingSkills: string[];
  resumeMistakes: string[];
  projectImprovements: string[];
  suggestedRoles: string[];
  interviewQuestions: string[];
};

function ListCard({
  title,
  items,
  icon,
  color,
}: {
  title: string;
  items?: string[];
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <h2 className={`text-xl font-bold ${color}`}>{title}</h2>
      </div>

      {items && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="text-sm text-gray-300 leading-relaxed flex gap-3">
              <span className="text-gray-500">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No data available.</p>
      )}
    </motion.div>
  );
}

export default function AnalysisResult() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("resumeAnalysis");

    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No analysis found</p>
          <Link to="/upload" className="text-sky-400 hover:text-sky-300">
            Upload a resume first
          </Link>
        </div>
      </div>
    );
  }

  const scoreColor =
    analysis.atsScore >= 80
      ? "text-emerald-400"
      : analysis.atsScore >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-white/5 px-8 h-16 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-sm font-medium">Analysis Result</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm">ResumeAI</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-white/5 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium mb-4">
                <CheckCircle size={13} />
                Analysis Complete
              </span>

              <h1 className="text-3xl font-bold mb-3">Resume Analysis Result</h1>

              <p className="text-gray-400 leading-relaxed max-w-2xl">
                {analysis.summary}
              </p>
            </div>

            <div className="text-center bg-white/[0.03] border border-white/5 rounded-2xl p-6 min-w-[170px]">
              <p className="text-sm text-gray-400 mb-2">ATS Score</p>
              <p className={`text-5xl font-bold ${scoreColor}`}>
                {analysis.atsScore}
              </p>
              <p className="text-xs text-gray-500 mt-1">/100</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <ListCard
            title="Strong Points"
            items={analysis.strongPoints}
            icon={<CheckCircle size={20} className="text-emerald-400" />}
            color="text-emerald-400"
          />

          <ListCard
            title="Weak Points"
            items={analysis.weakPoints}
            icon={<XCircle size={20} className="text-red-400" />}
            color="text-red-400"
          />

          <ListCard
            title="Missing Skills"
            items={analysis.missingSkills}
            icon={<AlertTriangle size={20} className="text-yellow-400" />}
            color="text-yellow-400"
          />

          <ListCard
            title="Resume Mistakes"
            items={analysis.resumeMistakes}
            icon={<XCircle size={20} className="text-orange-400" />}
            color="text-orange-400"
          />

          <ListCard
            title="Project Improvements"
            items={analysis.projectImprovements}
            icon={<CheckCircle size={20} className="text-sky-400" />}
            color="text-sky-400"
          />

          <ListCard
            title="Suggested Roles"
            items={analysis.suggestedRoles}
            icon={<FileText size={20} className="text-purple-400" />}
            color="text-purple-400"
          />
        </div>

        <ListCard
          title="Interview Questions"
          items={analysis.interviewQuestions}
          icon={<AlertTriangle size={20} className="text-cyan-400" />}
          color="text-cyan-400"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-sky-500/10 to-cyan-500/5 border border-sky-500/15 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold mb-1">Improve your resume and analyze again</p>
            <p className="text-sm text-gray-400">
              Apply the suggestions, upload the improved resume, and check your new score.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-white/10 text-gray-300 px-5 py-3 rounded-xl text-sm hover:bg-white/5 transition-all">
              <Share2 size={15} />
              Share
            </button>

            <button
  onClick={() => window.print()}
  className="flex items-center gap-2 border border-white/10 text-gray-300 px-5 py-3 rounded-xl text-sm hover:bg-white/5 transition-all"
>
  <Download size={15} />
  Export PDF
</button>

            <Link
              to="/upload"
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-5 py-3 rounded-xl font-medium text-sm transition-all"
            >
              <RotateCcw size={15} />
              Re-analyze
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}