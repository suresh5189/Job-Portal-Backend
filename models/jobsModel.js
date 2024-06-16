import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company Name Is Require"],
    },
    position: {
      type: String,
      required: [true, "Job Position Is Require"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Interview"],
      default: "Pending",
    },
    workType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
    },
    workLocation: {
      type: String,
      default: "Mumbai",
      required: [true, "Work Location Is Required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Jobs", jobsSchema);
