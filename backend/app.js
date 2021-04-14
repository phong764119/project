const express = require("express");
const path = require("path");
// const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const { DATABASE, PORT } = require("./config/server");
const mongoose = require("mongoose");
const { errorHandler, notFound } = require("./config/middleware");

mongoose.connect(DATABASE, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("connected to db");
});

// app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use("/api/v1/auth", require("./routes/userRoute"));

app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  res.send("ok");
});

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, console.log(`Server started on port ${PORT}`));
