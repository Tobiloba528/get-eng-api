const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const isCompany = require("../middleware/company");
const { Job } = require("../models/job");
const User = require("../models/user");

// Create a job
router.post("/jobs", auth, isCompany, async (req, res) => {
  const job = new Job({ ...req.body, owner: req.user._id });

  try {
    await job.save();
    res.status(201).send(job);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all jobs
router.get("/jobs", async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.role) {
    match.role = req.query.role;
  }
  if (req.query.type) {
    match.type = req.query.type;
  }
  if (req.query.level) {
    match.level = req.query.level;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const jobs = await Job.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    res.send(jobs);
  } catch (e) {
    res.status(500).send();
  }
});

// Get a Job with ID
router.get("/jobs/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const job = await Job.findOne({ _id });
    if (!job) {
      return res.status(404).send();
    }
    res.send(job);
  } catch (e) {
    res.status(500).send();
  }
});

// Apply for job
router.post("/jobs/:id/apply", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).send();
    }

    const isApplied = req.user.applied_jobs.some(
      (applied_job) => applied_job.job._id == id
    );

    if (isApplied) {
      return res.status(400).send({ error: "Job applied already" });
    }

    job.applied_users = job.applied_users.concat({
      full_name: req.user.full_name,
      email: req.user.email,
      username: req.user.username,
    });

    await job.save();

    req.user.applied_jobs = req.user.applied_jobs.concat({
      status: "pending",
      job,
    });

    await req.user.save();
    res.send(req.user.applied_jobs);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete applied job
router.delete("/jobs/:id/application/delete", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).send();
    }

    const isApplied = req.user.applied_jobs.some(
      (applied_job) => applied_job._id == id
    );

    if (!isApplied) {
      return res.status(400).send({ error: "Job already deleted" });
    }
    req.user.applied_jobs = req.user.applied_jobs.filter(
      (applied_job) => applied_job._id != id
    );
    await req.user.save();
    res.send(req.user.applied_jobs);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update job
router.patch("/jobs/:id", auth, isCompany, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "min_price_range",
    "max_price_range",
    "details",
    "role",
    "type",
    "languages",
    "level",
    "experience",
    "country",
    "state",
    "responsibility",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const job = await Job.findOne({ _id: req.params.id, owner: req.user._id });
    if (!job) {
      return res.status(404).send();
    }

    if (job.owner.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .send({ error: "You are not the creator of this job!" });
    }

    updates.forEach((update) => (job[update] = req.body[update]));
    await job.save();
    res.send(job);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get job applied user
router.get("/jobs/:id/applied_user", auth, isCompany, async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).send();
    }

    if (job.owner.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .send({ error: "You are not the creator of this job!" });
    }
    res.send(job.applied_users);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update job status
router.post(
  "/jobs/:id/update_status/:userId",
  auth,
  isCompany,
  async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.params.userId;
      const jobData = await Job.findById(id);

      if (!jobData) {
        return res.status(404).send();
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send();
      }

      const jobIndex = user.applied_jobs.findIndex(
        (job) => job.job._id.toString() === jobData._id.toString()
      );

      // console.log(jobIndex, "job index");

      if (jobIndex === -1) {
        return res.status(400).send({ error: "User has not applied for job" });
      }

      if (jobData.owner.toString() !== req.user._id.toString()) {
        console.log('problem')
        return res
          .status(400)
          .send({ error: "You are not the creator of this job!" });
      }
      // console.log('No problem')

      user.applied_jobs[jobIndex].status = "accepted";
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.delete("/jobs/:id", auth, isCompany, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!job) {
      return res.status(404).send();
    }

    if (job.owner.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .send({ error: "You are not the creator of this job!" });
    }

    res.send(job);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
