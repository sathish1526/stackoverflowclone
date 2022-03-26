require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const auth = require("./routers/user/auth");
const user = require("./routers/user/user");
const {getQuestions} = require("./controller/user/user");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/user/auth/", auth);
// app.use("/company", company);
app.use("/user",user);
app.use("/questions",getQuestions);
// app.use("/tags",tag);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
