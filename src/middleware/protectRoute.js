import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  // ✅ Replace requireAuth() with a manual check that returns 401 instead of redirecting
  (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    next();
  },
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      const user = await User.findOne({ clerkId });

      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
