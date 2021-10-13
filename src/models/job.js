const mongoose = require("mongoose");
const { job_level, job_type, job_role } = require('../constants/enums')

const jobSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   trim: true,
  //   lowercase: true,
  // },
  min_price_range: {
    type: String,
    required: true,
  },
  max_price_range: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(job_role),
    required: true,
  },
  languages: [String],
  level: {
    type: String,
    enum: Object.values(job_level),
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(job_type),
    required: true,
  },
  experience: Number,
  country: String,
  state: String,
  responsibility: String,
  applied_users: [
    {
      full_name: {
        type: String,
        trim: true,
      },
      username: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

jobSchema.methods.toJSON = function () {
  const job= this;

  const jobObject = job.toObject();
  
  delete jobObject.applied_users;
  return jobObject;
};

const Job = mongoose.model("Job", jobSchema);

module.exports = {
  Job,
  jobSchema,
};
