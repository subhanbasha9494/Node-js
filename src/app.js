const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Subhan",
    lastName: "Basha",
    emailId: "subhantest@gmail.com",
    password: "sami"
  }
  //Creating a new instance of the User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Created Succesfully");
  } catch (err) {
    res.status(400).send("Something Error",err.message)
  }
});


connectDB().then(() => {
  console.log("Connected to DB");
  app.listen(9494, () => {
    console.log("Server is running on port 9494");
  });
}).catch((err) => {
  console.log("Error connecting to DB", err);
});



// const { adminAuth, userAuth } = require("./middlewares/auth")



// //use try catch
// app.get("/getUserData", (req, res) => {
//   try {
//     throw new Error("Something wrong");
//     res.send("Hello Node Js");
//   }
//   catch (err) {
//     res.status(500).send("Something1 went wrong");
//   }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something went wrong");
//   }
// })
// //Handle Auth Middleware for all Get POST, ....requests

// app.use("/admin", adminAuth);

// app.get("/admin/", (req, res) => {
//   res.send("All Data Sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("Deleted User ");
// });

// app.use("/user", userAuth, (req, res) => {
//   console.log("first middleware");
//   res.send({ firstName: "subhan", lastName: "sami" })
// }, (req, res) => {
//   console.log("second middleware");
//   res.send({ firstName: "subhan", lastName: "sami" })
// })

// app.use("/user", (req, res, next) => {
//   console.log("first middleware");
//   //res.send({ firstName: "subhan", lastName: "sami" })
//   next();
// }, (req, res) => {
//   console.log("second middleware");
//   res.send({ firstName: "subhan", lastName: "sami" })
// });

// app.get("/user", (req, res) => {
//   res.send({ firstName: "subhan", lastName: "sami" })
// });

// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "subhan", lastName: "sami" })
// });



