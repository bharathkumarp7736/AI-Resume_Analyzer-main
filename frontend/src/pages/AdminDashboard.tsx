import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  FileText,
  Crown,
  Shield,
  Briefcase,
  Clock,
  LogOut,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AdminStats = {
  totalUsers: number;
  totalResumes: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    plan: string;
    role: string;
    createdAt: string;
  }[];
  recentResumes: {
    _id: string;
    fileName: string;
    createdAt: string;
    user?: {
      name: string;
      email: string;
    };
    analysis?: {
      atsScore: number;
      summary: string;
    };
  }[];
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is missing");
      }

      if (!token) {
        navigate("/login");
        return;
      }

      if (user?.role !== "admin") {
        alert("Admin access only");
        navigate("/dashboard");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch admin stats");
      }

      setStats(data);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Admin data fetch failed");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Admin data not available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-white/5 px-8 h-16 flex items-center justify-between bg-gray-950/90 backdrop-blur-md sticky top-0 z-10">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">
              {user?.email || "admin@example.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Shield size={20} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <p className="text-gray-400">
            Monitor users, resumes, plans, and recent platform activity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "text-sky-400",
            },
            {
              label: "Total Resumes",
              value: stats.totalResumes,
              icon: FileText,
              color: "text-emerald-400",
            },
            {
              label: "Free Users",
              value: stats.freeUsers,
              icon: Users,
              color: "text-gray-400",
            },
            {
              label: "Pro Users",
              value: stats.proUsers,
              icon: Crown,
              color: "text-yellow-400",
            },
            {
              label: "Enterprise",
              value: stats.enterpriseUsers,
              icon: Briefcase,
              color: "text-purple-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">{item.label}</p>
                <item.icon size={18} className={item.color} />
              </div>

              <p className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Users</h2>
              <Users size={18} className="text-sky-400" />
            </div>

            <div className="space-y-3">
              {stats.recentUsers.map((item) => (
                <div
                  key={item._id}
                  className="border border-white/5 rounded-xl p-4 bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-400">
                        {item.plan}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.role === "admin"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
                    <Clock size={11} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Resume Analyses</h2>
              <FileText size={18} className="text-emerald-400" />
            </div>

            <div className="space-y-3">
              {stats.recentResumes.map((item) => (
                <div
                  key={item._id}
                  className="border border-white/5 rounded-xl p-4 bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.fileName}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded by: {item.user?.name || "Unknown"}{" "}
                        {item.user?.email ? `(${item.user.email})` : ""}
                      </p>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                      ATS {item.analysis?.atsScore || 0}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                    {item.analysis?.summary || "No summary available"}
                  </p>

                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
                    <Clock size={11} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}