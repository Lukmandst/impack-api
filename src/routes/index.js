const Router = require("express").Router();
const productRouter = require("./products");

Router.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Impack API",
  });
});

Router.use("/products", productRouter);

Router.get("*", (_req, res) => {
  res.status(404).json({
    message: "Api Not Found",
  });
});

module.exports = Router;
