import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobsController,
} from "../controllers/jobsController.js";

//router object
const router = express.Router();

// routes
// CREATE JOB || POST
router.post("/create-job", userAuth, createJobController);

// GET JOBS || GET
router.get("/get-job", userAuth, getAllJobsController);

// UPDATE JOB || PUT || PATCH
router.patch("/update-job/:id", userAuth, updateJobsController);

// DELETE JOB || DELETE
router.delete("/delete-job/:id", userAuth, deleteJobController);

// JOBS STAT FILTER || GET
router.get("/job-stats", userAuth, jobStatsController);

export default router;
