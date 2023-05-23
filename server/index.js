const express = require("express");
const cors = require("cors");
const colors = require("colors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute)

app.get("/", (req, res) => {
  res.send("Welcome our CHAT-APP APIs...")
});

const port = process.env.POST || 5500;
const uri  = process.env.ATLAS_URI;
app.listen(port, (req, res) => {
  console.log(`Server running in ${process.env.MODE_ENV} mode on port ${port}`.yellow.bold)
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connection Success!!".blue.bold))
  .catch((error) => console.log("MongoDB connection fail: ".red.bold, error.message))