const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const jobRouter = require("./routers/job");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(userRouter);
app.use(jobRouter);

module.exports = app;
