import jobsModel from "../models/jobsModel.js";
import mongoose, { mongo } from "mongoose";
import moment from "moment";

//  --------------- CREATE JOB ---------------------
export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
};

// -------------------- GET ALL JOBS ---------------------
export const getAllJobsController = async (req, res, next) => {
  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  const { status, workType, search, sort } = req.query;

  // Condition For Searching Filters
  const queryObject = { createdBy: req.user.userId };

  // Logic Filters
  if (status && status !== "All") {
    queryObject.status = status;
  }

  if (workType && workType !== "All") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  // Sorting
  if (sort === "Latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  if (sort === "Oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);

  // Jobs Count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;
  res.status(200).json({ totalJobs, jobs, numOfPage });
};

// ----------------- UPDATE JOB ----------------------
export const updateJobsController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  // validation
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  // find job
  const job = await jobsModel.findOne({ _id: id });
  // validation
  if (!job) {
    next(`No Job Found With This Id ${id}`);
  }
  if (!(req.user.userId === job.createdBy.toString())) {
    next("Your Are Not Authorized To Update This Job");
    return;
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
};

// ---------------------- DELETE JOB ----------------------

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  // find job
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No Job Found With This Id ${id}`);
  }
  if (!(req.user.userId === job.createdBy.toString())) {
    next("You Are Not Authorized To Delete This Job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Success, Job Deleted!",
  });
};

// --------------- JOB STATS AND FILTER -----------------------

export const jobStatsController = async (req, res, next) => {
  const stats = await jobsModel.aggregate([
    // Search By User Jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Default Stats
  const defaultStats = {
    Pending: stats.Pending || 0,
    Reject: stats.Reject || 0,
    Interview: stats.Interview || 0,
  };

  // Monthly Yearly Stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};
