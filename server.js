require("dotenv").config();
const express = require("express");

const mainRouter = require("./src/routes/index");
const { dbConn } = require("./src/config/database");

dbConn();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mainRouter);
app.listen(PORT, console.log(`Server is Running at port ${PORT}`));
