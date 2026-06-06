import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  User,
  Mail,
  Shield,
  Calendar,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-white/5 px-8 h-16 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm">ResumeAI</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-white/5 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-3xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-1">
                {user?.name || "User"}
              </h1>
              <p className="text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <User size={20} className="text-sky-400" />
              <h2 className="text-xl font-bold">Account Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="text-sm">{user?.name || "User"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="text-sm flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">User ID</p>
                <p className="text-sm text-gray-400 break-all">
                  {user?.id || "Not available"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <Shield size={20} className="text-emerald-400" />
              <h2 className="text-xl font-bold">Plan Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Plan</p>
                <p className="text-sm font-semibold text-cyan-400">
  {user?.plan ? user.plan.toUpperCase() : "FREE"}
</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Monthly Limit</p>
                <p className="text-sm">3 resume analyses/month</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Upgrade</p>
                <Link
                  to="/"
                  className="inline-flex text-sm text-sky-400 hover:text-sky-300"
                >
                  View pricing plans
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 size={20} className="text-yellow-400" />
              <h2 className="text-xl font-bold">Usage</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Analyses Limit</p>
                <p className="text-sm">Free users can analyze 3 resumes.</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">PDF Export</p>
                <p className="text-sm">Available</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gray-900 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <Calendar size={20} className="text-purple-400" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>

            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="block text-sm text-sky-400 hover:text-sky-300"
              >
                Change password
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}