const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const brcypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
// Parse JSON bodies
app.use(express.json());
app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Ms",
  //   lastName: "Dhoni",
  //   emailId: "dhoni@gmail.com",
  //   password: "dhoni07"
  // }

  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await brcypt.hash(password, 10);
    //Creating a new instance of the User model
    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    await user.save();
    res.send("User Added Succesfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentails");
    }
    const isPasswordValid = await brcypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfull");
    }else{
      throw new Error("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)
  }
})


app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      return res.status(200).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something Error", err.message)
  };
});

//Feed API - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something Error", err.message)
  }
});


app.delete("/userdel/:userId", async (req, res) => {
  let userId = req.params.userId;
  console.log("Received userId:", userId);
  if (!userId) {
    return res.status(400).send("userId is required");
  }
  try {
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      return res.status(200).send("User not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something Error", err.message)
  };
});

app.patch("/userupdate", async (req, res) => {
  let userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills"
    ]
    const isUpdateAllowed = Object.keys(data).every((key) => {
      return ALLOWED_UPDATES.includes(key);
    });
    if (!isUpdateAllowed) {
      throw new Error("Invalid update");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    if (!user) {
      return res.status(200).send("User not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).send(err.message)
  };
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



