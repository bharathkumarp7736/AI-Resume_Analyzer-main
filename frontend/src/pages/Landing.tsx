import { motion, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  BarChart2,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Our advanced AI scans your resume against thousands of job descriptions to surface precise, actionable insights.",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description:
      "Ensure your resume passes Applicant Tracking Systems with keyword matching and format scoring.",
  },
  {
    icon: BarChart2,
    title: "Section-by-Section Scoring",
    description:
      "Get a detailed breakdown of every section — skills, experience, summary, and more.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Upload your resume and receive a comprehensive analysis report in under 30 seconds.",
  },
  {
    icon: TrendingUp,
    title: "Career Progress Tracking",
    description:
      "Monitor how your resume improves over time with version history and score trends.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume data is encrypted and never shared. Delete it anytime, instantly.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    quote:
      "ResumeAI helped me land my dream job. My score went from 61 to 89 after following the suggestions.",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    name: "Marcus Williams",
    role: "Product Manager at Stripe",
    quote:
      "The ATS optimization alone was worth it. I started getting callbacks within a week of updating my resume.",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
  {
    name: "Priya Nair",
    role: "Data Scientist at Meta",
    quote:
      "Incredibly detailed feedback. It identified gaps I never would have noticed on my own.",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "3 resume analyses/month",
      "Basic ATS score",
      "Keyword suggestions",
      "PDF export",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    features: [
      "20 resume analyses/month",
      "Advanced ATS optimization",
      "Section-by-section scoring",
      "Job description matching",
      "Version history",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "per month",
    features: [
      "Unlimited analyses",
      "Team dashboard",
      "Custom job profiles",
      "API access",
      "Dedicated account manager",
      "SSO & audit logs",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeId");
    navigate("/");
  };

  const handlePlanClick = async (planName: string) => {
    try {
      if (planName === "Free") {
        window.location.href = token ? "/dashboard" : "/register";
        return;
      }

      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        window.location.href = "/login";
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is missing");
      }

      const response = await fetch(
        `${API_BASE_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({
            plan: planName.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">ResumeAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Reviews
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <>
                <span className="text-sm text-gray-400 hidden sm:block">
                  Hi, {user?.name || "User"}
                </span>

                <Link
                  to="/dashboard"
                  className="text-sm bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="text-sm bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-sm text-sky-400 mb-6"
          >
            <Zap size={14} />
            AI-powered resume analysis — results in 30 seconds
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your resume,{" "}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              optimized
            </span>{" "}
            for every role.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, paste a job description, and get an instant
            AI-powered analysis with actionable improvements to maximize your
            interview callbacks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {token ? (
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-sky-500/25"
              >
                Go to Dashboard
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-sky-500/25"
                >
                  Analyze Your Resume Free
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-gray-500"
          >
            No credit card required. Free plan includes 3 analyses per month.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-20 grid grid-cols-3 gap-6"
        >
          {[
            { value: "50K+", label: "Resumes Analyzed" },
            { value: "3.2x", label: "More Callbacks" },
            { value: "94%", label: "User Satisfaction" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-sky-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to get hired
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A complete toolkit to craft resumes that stand out — and get
              through ATS filters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-sky-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                  <feature.icon size={22} className="text-sky-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by job seekers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-sky-500 border-2 border-sky-400 shadow-2xl shadow-sky-500/20"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={`text-sm mb-1 ${
                        plan.highlighted ? "text-sky-100" : "text-gray-400"
                      }`}
                    >
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle
                        size={16}
                        className={
                          plan.highlighted ? "text-sky-100" : "text-sky-400"
                        }
                      />
                      <span
                        className={
                          plan.highlighted ? "text-sky-50" : "text-gray-300"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-white text-sky-600 hover:bg-sky-50"
                      : "bg-sky-500 hover:bg-sky-400 text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-500/20 rounded-3xl p-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to get more interviews?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of job seekers who improved their resume score and
            landed their dream roles.
          </p>

          <Link
            to={token ? "/dashboard" : "/register"}
            className="group inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-sky-500/30"
          >
            {token ? "Go to Dashboard" : "Start Analyzing for Free"}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
              <FileText size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm">ResumeAI</span>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 ResumeAI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}