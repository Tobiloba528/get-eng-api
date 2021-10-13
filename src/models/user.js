const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { jobSchema } = require("../models/job");
const { job_role, job_level } = require('../constants/enums')

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain password");
        }
      },
      trim: true,
    },
    user_type: {
      type: String,
      required: true,
      enum: ['user', 'company']
    },
    date_of_birth: {
      type: Date,
      default: Date.now,
    },
    skill_level: {
      type: String,
      trim: true,
      enum: Object.values(job_level)
    },
    role: {
      type: String,
      enum: Object.values(job_role)
    },
    sex: {
      type: String,
    },
    phone_number: {
      type: String,
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    applied_jobs: [
      {
        status: String,
        job: jobSchema,
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.applied_jobs;
  return userObject;
};

userSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), username: user.username },
    process.env.JWT_SECRET
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to log in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to log in");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
