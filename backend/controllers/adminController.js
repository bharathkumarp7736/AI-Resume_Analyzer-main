import User from "../models/User.js";
import Resume from "../models/Resume.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalResumes = await Resume.countDocuments();

    const freeUsers = await User.countDocuments({
      plan: "free",
    });

    const proUsers = await User.countDocuments({
      plan: "pro",
    });

    const enterpriseUsers = await User.countDocuments({
      plan: "enterprise",
    });

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentResumes = await Resume.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalResumes,
      freeUsers,
      proUsers,
      enterpriseUsers,
      recentUsers,
      recentResumes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};