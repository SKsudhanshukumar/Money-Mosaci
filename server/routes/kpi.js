import express from "express";
import KPI from "../models/KPI.js";

const router = express.Router();

// Get all KPIs - main endpoint
router.get("/", async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Legacy endpoint for backward compatibility
router.get("/kpis", async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
