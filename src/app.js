const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const jobRouter = require("./routers/job");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(jobRouter);

module.exports = app;
