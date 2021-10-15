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
  user_type: 'user',
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
    user_type: 'company',
    tokens: [
      {
        token: jwt.sign({ _id: companyOneId }, process.env.JWT_SECRET),
      },
    ],
  };

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(companyOne).save();
};

module.exports = {
  userOneId,
  userOne,
  companyOne,
  companyOneId,
  setupDatabase,
};
