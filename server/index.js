const express = require("express");
const cors = require("cors");
const colors = require("colors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const isDate = new Date();

app.get("/", (req, res) => {
  res.send(
    `<h1 style="color: #727272;">Running CHAT-APP APIs... 🚀</h1> ${isDate}`
  );
});

const port = process.env.POST || 5500;
const uri = process.env.ATLAS_URI;
app.listen(port, (req, res) => {
  console.log(
    `Server running in ${process.env.MODE_ENV} mode on port ${port}`.yellow.bold
  );
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection Success!!".blue.bold))
  .catch((error) =>
    console.log("MongoDB connection fail: ".red.bold, error.message)
  );
