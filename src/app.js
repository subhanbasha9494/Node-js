const express = require("express");

const app = express();
const { adminAuth, userAuth   } = require("./middlewares/auth")

//Handle Auth Middleware for all Get POST, ....requests

app.use("/admin", adminAuth);

app.get("/admin/", (req,res)=> {
  res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req,res)=> {
  res.send("Deleted User ");
});

app.use("/user", userAuth, (req, res) => {
  console.log("first middleware");
  res.send({ firstName: "subhan", lastName: "sami" })
}, (req, res) => {
  console.log("second middleware");
  res.send({ firstName: "subhan", lastName: "sami" })
})

app.use("/user", (req, res, next) => {
  console.log("first middleware");
  //res.send({ firstName: "subhan", lastName: "sami" })
  next();
}, (req, res) => {
  console.log("second middleware");
  res.send({ firstName: "subhan", lastName: "sami" })
});

app.get("/user", (req, res) => {
  res.send({ firstName: "subhan", lastName: "sami" })
});

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "subhan", lastName: "sami" })
});



app.listen(9494, () => {
  console.log("Server is running on port 9494");
});
