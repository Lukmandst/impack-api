require("dotenv").config();
const cors = require("cors");
const express = require("express");

const mainRouter = require("./src/routes/index");
const { dbConn } = require("./src/config/database");

dbConn();

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: ["*", "http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mainRouter);
app.listen(PORT, console.log(`Server is Running at port ${PORT}`));
