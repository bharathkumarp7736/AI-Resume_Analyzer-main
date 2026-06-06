import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, FileText } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900 border border-white/5 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <XCircle size={36} className="text-red-400" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>

        <p className="text-gray-400 mb-8">
          Your payment was cancelled. You can continue using the free plan or upgrade later.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-3 rounded-xl font-semibold transition-all"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="border border-white/10 hover:bg-white/5 text-gray-300 px-5 py-3 rounded-xl font-semibold transition-all"
          >
            View Pricing
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm">
          <FileText size={14} />
          ResumeAI
        </div>
      </motion.div>
    </div>
  );
}