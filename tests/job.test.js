const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");
const { Job } = require("../src/models/job");
const {
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
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create job for company user", async () => {
  const response = await request(app)
    .post("/jobs")
    .set("Authorization", `Bearer ${companyOne.tokens[0].token}`)
    .send({
      role: "DEVOPS",
      min_price_range: "10000",
      max_price_range: "30000",
      details: "This role is for a DEVOPS",
      level: "INTERMEDIATE",
      type: "FULL_TIME",
    })
    .expect(201);

  const job = await Job.findById(response.body._id);
  expect(job).not.toBeNull();
  expect(job.role).toEqual("DEVOPS");
});




test("Should not create job for a normal user", async () => {
  await request(app)
    .post("/jobs")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      role: "DEVOPS",
      min_price_range: "10000",
      max_price_range: "30000",
      details: "This role is for a DEVOPS",
      level: "INTERMEDIATE",
      type: "FULL_TIME",
    })
    .expect(401);
});



test("Should fetch all jobs", async () => {
  await request(app).get("/jobs").send().expect(200);
});



test("Should fetch jobOne", async () => {
  await request(app).get(`/jobs/${jobOne._id}`).send().expect(200);
});



test('Should apply userOne for jobOne', async () => {
  await request(app)
      .post(`/jobs/${jobOne._id}/apply`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
})


test("Should update job by creator", async () => {
  await request(app)
  .patch(`/jobs/${jobOne._id}`)
  .set('Authorization', `Bearer ${companyOne.tokens[0].token}`)
  .send({ min_price_range: "90000" })
  .expect(200)
})

test("Should not update invalid job field by creator", async () => {
  await request(app)
  .patch(`/jobs/${jobOne._id}`)
  .set('Authorization', `Bearer ${companyOne.tokens[0].token}`)
  .send({ min_price: "90000" })
  .expect(400)
})

test("Should not update job by non-creator", async () => {
  await request(app)
  .patch(`/jobs/${jobOne._id}`)
  .set('Authorization', `Bearer ${companyTwo.tokens[0].token}`)
  .send({ min_price_range: "90000" })
  .expect(401)
})


test("Should delete job by creator", async () => {
  await request(app)
    .delete(`/jobs/${jobOne._id}`)
    .set("Authorization", `Bearer ${companyOne.tokens[0].token}`)
    .send()
    .expect(200);
});





test("Should not delete job by not-creator", async () => {
  await request(app)
    .delete(`/jobs/${jobOne._id}`)
    .set("Authorization", `Bearer ${companyTwo.tokens[0].token}`)
    .send()
    .expect(401);
});
