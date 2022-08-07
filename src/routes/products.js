const Router = require("express").Router();

const {
  findProductByQuery,
  deleteProductById,
  updateProductById,
  postNewProduct,
} = require("../controllers/products");

Router.get("/", findProductByQuery);
Router.post("/", postNewProduct);
Router.patch("/:id", updateProductById);
Router.delete("/:id", deleteProductById);

module.exports = Router;
