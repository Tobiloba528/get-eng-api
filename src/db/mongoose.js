const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// const User = mongoose.model("User", {
//   name: {
//     type: String
//   },
//   age: {
//     type: Number
//   }
// })

// const me = new User({
//   name: "Andrew",
//   age: 13
// });

// me.save().then(() => {
//   console.log(me);
// }).catch(error => {
//   console.log('Error', error)
// })
