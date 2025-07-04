const express = require("express");

const app = express();

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
