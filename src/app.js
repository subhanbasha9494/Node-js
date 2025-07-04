const express = require("express");

const app = express();

app.use("/test",(req,res) => {
  res.send("My first requestHandler using nodemon 1");
})

app.listen(9494, () => {
    console.log("Server is running on port 9494");
});
