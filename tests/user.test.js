const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
  userOne,
  userOneId,
  companyOne,
  companyOneId,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      username: "badoo",
      email: "badoo@example.com",
      phone_number: "9302849392",
      password: "test123",
      user_type: "user",
    })
    .expect(201);

  // Assertions that the datatbase was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      username: "badoo",
      email: "badoo@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("test123");
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ username: "Olamide" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.username).toEqual("Olamide");
});



test("Should get company user jobs", async () => {
  await request(app)
    .get("/users/jobs")
    .set("Authorization", `Bearer ${companyOne.tokens[0].token}`)
    .send()
    .expect(200);
});



test("Should not get user jobs", async () => {
  await request(app)
    .get("/users/jobs")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(401);
});



test("Should get applied jobs for authenticated user", async () => {
  await request(app)
    .get("/users/applied_jobs")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get applied jobs for authenticated user", async () => {
    await request(app)
      .get("/users/applied_jobs")
      .send()
      .expect(401);
  });
  


test("Should not update invalid user fields", async () => {
    await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .send({ location: "Lagos" })
      .expect(400);
  });



test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Lagos" })
    .expect(400);
});

test("Should login existing user ", async () => {
  const response = await request(app)
    .post("/oauth")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/oauth")
    .send({
      email: "wrong@example.com",
      password: "test123",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should logout current authenticated user", async () => {
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should logout authenticated user", async () => {
  await request(app).post("/users/logout").send().expect(401);
});

test("Should not delete account for  unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
