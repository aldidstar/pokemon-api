require("dotenv").config();

const express = require("express");
var app = express();
var cors = require("cors");
var logger = require("morgan");
const mongoose = require("mongoose");
const { finalError } = require("./middlewares/errorHandler");
var router = require("./routes/pokemon");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger("dev"));

//Mongo Atlas/Mlab Configuration
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));
db.once("open", () => console.log("MongoDB Connected!"));

app.use("/api", router);
// app.use('/api')

//Error Handler
finalError.forEach((handler) => app.use(handler));

module.exports = app;
