import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  X,
  CheckCircle,
  Loader2,
  ArrowLeft,
  FileUp,
  Briefcase,
  ChevronDown,
} from 'lucide-react';

const jobTitles = [
  'Software Engineer',
  'Senior Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'UX Designer',
  'Machine Learning Engineer',
  'Engineering Manager',
];

type UploadStep = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === 'application/pdf' || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
  };

const handleAnalyze = async () => {
  if (!file || !jobTitle) return;

  try {
    setStep("uploading");
    setProgress(20);

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    setProgress(50);

    setStep("analyzing");

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/resume/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    setProgress(100);
    setStep("done");

    localStorage.setItem(
      "resumeAnalysis",
      JSON.stringify(data.analysis)
    );

    localStorage.setItem(
      "resumeId",
      data.resumeId
    );

    setTimeout(() => {
      navigate("/result");
    }, 1000);

  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );

    setStep("idle");
    setProgress(0);
  }
};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-sm font-medium">New Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm">ResumeAI</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Analyze Your Resume</h1>
          <p className="text-gray-400 mb-10">Upload your resume and optionally provide a job description for a targeted analysis.</p>

          {/* Upload zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              dragOver
                ? 'border-sky-500 bg-sky-500/5'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-white/10 hover:border-white/20'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle size={28} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-400">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                    Remove
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                    <FileUp size={26} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Drop your resume here</p>
                    <p className="text-sm text-gray-500">or click to browse — PDF or DOCX, up to 5MB</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Job title */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Briefcase size={14} className="inline mr-2 text-sky-400" />
              Target Job Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none focus:border-sky-500 transition-all"
              >
                <span className={jobTitle ? 'text-white' : 'text-gray-500'}>{jobTitle || 'Select a job title...'}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    {jobTitles.map((title) => (
                      <li
                        key={title}
                        className="px-4 py-2.5 text-sm hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => { setJobTitle(title); setShowDropdown(false); }}
                      >
                        {title}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Job description */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
              <span className="text-gray-500 font-normal ml-2">(optional, for deeper matching)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here to get keyword matching and role-specific suggestions..."
              rows={6}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all resize-none"
            />
          </div>

          {/* Analyze button */}
          <div className="mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!file || !jobTitle || step !== 'idle'}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all"
            >
              {step === 'idle' && (
                <>
                  <Upload size={20} />
                  Analyze Resume
                </>
              )}
              {step === 'uploading' && (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading...
                </>
              )}
              {step === 'analyzing' && (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing with AI...
                </>
              )}
              {step === 'done' && (
                <>
                  <CheckCircle size={20} />
                  Analysis Complete!
                </>
              )}
            </button>

            {/* Progress bar */}
            <AnimatePresence>
              {(step === 'uploading' || step === 'analyzing') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>{step === 'uploading' ? 'Uploading resume...' : 'Running AI analysis...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { label: 'Parsing document structure', done: progress >= 30 },
                      { label: 'Extracting keywords & skills', done: progress >= 60 },
                      { label: 'Matching against job requirements', done: progress >= 80 },
                      { label: 'Generating improvement suggestions', done: progress >= 100 },
                    ].map((item) => (
                      <div key={item.label} className={`flex items-center gap-2 text-xs transition-colors ${item.done ? 'text-emerald-400' : 'text-gray-600'}`}>
                        <CheckCircle size={12} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
