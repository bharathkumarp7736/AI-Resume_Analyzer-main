import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState("Updating your plan...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePlan();
  }, []);

  const updatePlan = async () => {
    try {
      const plan = searchParams.get("plan") || "pro";
      const token = localStorage.getItem("token");

      if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is missing");
      }

      if (!token) {
        throw new Error("Login token missing. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/payment/update-plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update plan");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(`Your plan has been upgraded to ${plan.toUpperCase()} successfully.`);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Payment successful, but plan update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900 border border-white/5 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
          {loading ? (
            <Loader2 size={36} className="text-emerald-400 animate-spin" />
          ) : (
            <CheckCircle size={36} className="text-emerald-400" />
          )}
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Successful</h1>

        <p className="text-gray-400 mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          <Link
            to="/profile"
            className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-3 rounded-xl font-semibold transition-all"
          >
            View Profile
          </Link>

          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="border border-white/10 hover:bg-white/5 text-gray-300 px-5 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm">
          <FileText size={14} />
          ResumeAI
        </div>
      </motion.div>
    </div>
  );
}