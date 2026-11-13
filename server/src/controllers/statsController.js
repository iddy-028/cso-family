import asyncHandler from "../utils/asyncHandler.js";
import { getDashboardStats } from "../services/statsService.js";

export const dashboardStats = asyncHandler(async (req, res) => {
  res.json(await getDashboardStats());
});
