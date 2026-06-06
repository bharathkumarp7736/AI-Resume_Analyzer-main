import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  LayoutDashboard,
  Upload,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ResumeHistoryItem = {
  _id: string;
  fileName: string;
  createdAt: string;
  analysis: {
    atsScore: number;
    summary: string;
  };
};

type Usage = {
  used: number;
  limit: number | null;
  plan: string;
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
};

const scoreRingColor = (score: number) => {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
};

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#ffffff10"
        strokeWidth="6"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={scoreRingColor(score)}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [usage, setUsage] = useState<Usage>({
    used: 0,
    limit: 3,
    plan: "free",
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      to: "/dashboard",
      active: true,
    },
    {
      icon: Upload,
      label: "Upload Resume",
      to: "/upload",
      active: false,
    },
    ...(user?.role === "admin"
      ? [
          {
            icon: TrendingUp,
            label: "Admin",
            to: "/admin",
            active: false,
          },
        ]
      : []),
    {
      icon: Settings,
      label: "Profile",
      to: "/profile",
      active: false,
    },
  ];

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is missing");
      }

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/resume/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch history");
      }

      setHistory(data.resumes || []);

      if (data.usage) {
        setUsage({
          used: data.usage.used || 0,
          limit:
            data.usage.limit === null ||
            data.usage.limit === "Infinity" ||
            data.usage.limit === Infinity
              ? null
              : data.usage.limit,
          plan: data.usage.plan || user?.plan || "free",
        });
      } else {
        const fallbackPlan = user?.plan || "free";
        const fallbackLimit =
          fallbackPlan === "enterprise"
            ? null
            : fallbackPlan === "pro"
            ? 20
            : 3;

        setUsage({
          used: data.resumes?.length || 0,
          limit: fallbackLimit,
          plan: fallbackPlan,
        });
      }
    } catch (error) {
      console.error(error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const bestScore =
    history.length > 0
      ? Math.max(...history.map((item) => item.analysis?.atsScore || 0))
      : 0;

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + (item.analysis?.atsScore || 0),
            0
          ) / history.length
        )
      : 0;

  const usagePercent =
    usage.limit === null
      ? 100
      : Math.min((usage.used / usage.limit) * 100, 100);

  const usageText =
    usage.limit === null
      ? `${usage.used} used / Unlimited`
      : `${usage.used} of ${usage.limit} used`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeId");
    navigate("/");
  };

  const openAnalysis = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resume");
      }

      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(data.resume.analysis)
      );
      localStorage.setItem("resumeId", data.resume._id);

      navigate("/result");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to open analysis");
    }
  };

  const deleteResume = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume analysis?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resume");
      }

      await fetchHistory();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete resume");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-white/5 p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <FileText size={15} className="text-white" />
          </div>
          <span className="font-bold text-base">ResumeAI</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}
              </p>
            </div>

            <Link
              to="/upload"
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
            >
              <Plus size={16} />
              New Analysis
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: "Analyses Used",
                value: usage.used,
                sub:
                  usage.limit === null ? "Unlimited plan" : `Limit ${usage.limit}`,
                color: "text-sky-400",
              },
              {
                label: "Best Score",
                value: bestScore,
                sub: "Out of 100",
                color: "text-emerald-400",
              },
              {
                label: "Avg Score",
                value: averageScore,
                sub: "All analyses",
                color: "text-amber-400",
              },
              {
                label: "Plan",
                value: usage.plan.toUpperCase(),
                sub:
                  usage.limit === null ? "Unlimited" : `${usage.limit} analyses`,
                color: "text-cyan-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-900 border border-white/5 rounded-2xl p-5"
              >
                <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </motion.div>

          <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Monthly Analyses</span>
              <span className="text-sm text-gray-400">{usageText}</span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Analyses</h2>
            <button
              onClick={fetchHistory}
              className="text-sm text-sky-400 hover:text-sky-300"
            >
              Refresh
            </button>
          </div>

          {history.length === 0 ? (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 text-center">
              <p className="font-semibold mb-2">No resume analyses yet</p>
              <p className="text-sm text-gray-400 mb-5">
                Upload your first resume to get AI-powered feedback.
              </p>

              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-xl font-medium text-sm"
              >
                <Upload size={15} />
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => {
                const score = item.analysis?.atsScore || 0;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-center gap-5 hover:border-sky-500/20 transition-all group cursor-pointer"
                    onClick={() => openAnalysis(item._id)}
                  >
                    <div className="relative shrink-0">
                      <ScoreRing score={score} size={64} />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-sm font-bold ${scoreColor(score)}`}
                        >
                          {score}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm truncate">
                          {item.fileName}
                        </p>

                        <span className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                          <CheckCircle size={10} />
                          completed
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 line-clamp-2">
                        {item.analysis?.summary || "No summary available"}
                      </p>

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock size={11} />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteResume(item._id);
                        }}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-all"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>

                      <ChevronRight
                        size={18}
                        className="text-gray-600 group-hover:text-sky-400 transition-colors"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}