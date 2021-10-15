const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const { Job } = require("../../src/models/job");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  username: "Mike",
  email: "mike@example.com",
  password: "test123",
  phone_number: "493858594",
  user_type: "user",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const companyOneId = new mongoose.Types.ObjectId();
const companyOne = {
  _id: companyOneId,
  username: "Andrew",
  email: "andrew@example.com",
  password: "test123",
  phone_number: "49385859412",
  user_type: "company",
  tokens: [
    {
      token: jwt.sign({ _id: companyOneId }, process.env.JWT_SECRET),
    },
  ],
};

const companyTwoId = new mongoose.Types.ObjectId();
const companyTwo = {
  _id: companyTwoId,
  username: "Dele",
  email: "dele@example.com",
  password: "test123",
  phone_number: "49385859400",
  user_type: "company",
  tokens: [
    {
      token: jwt.sign({ _id: companyTwoId }, process.env.JWT_SECRET),
    },
  ],
};



const jobOne = {
  _id: new mongoose.Types.ObjectId(),
  role: "DEVOPS",
  min_price_range: "5000",
  max_price_range: "20000",
  details: "This role is for a DEVOPS",
  level: "INTERMEDIATE",
  type: "FULL_TIME",
  owner: companyOneId
};
const jobTwo = {
  _id: new mongoose.Types.ObjectId(),
  role: "FRONTEND_DEVELOPER",
  min_price_range: "40000",
  max_price_range: "100000",
  details: "This role is for a FRONTEND DEVELOPER",
  level: "JUNIOR",
  type: "PART_TIME",
  owner: companyOneId
};
const jobThree = {
    _id: new mongoose.Types.ObjectId(),
  role: "BACKEND_DEVELOPER",
  min_price_range: "200000",
  max_price_range: "5000000",
  details: "This role is for a BACKEND DEVELOPER",
  level: "SENIOR",
  type: "FULL_TIME",
  owner: companyTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Job.deleteMany();
  await new User(userOne).save();
  await new User(companyOne).save();
  await new Job(jobOne).save();
  await new Job(jobTwo).save();
  await new Job(jobThree).save();
};

module.exports = {
  userOneId,
  userOne,
  companyOne,
  companyOneId,
  companyTwo,
  companyTwoId,
  jobOne,
  jobTwo,
  jobThree,
  setupDatabase,
};
