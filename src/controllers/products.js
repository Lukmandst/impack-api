const {
  successResponsewihMeta,
  errorResponseDefault,
  successResponseDefault,
  successResponseWithMsg,
} = require("../helpers/response");
const {
  createNewProduct,
  findProduct,
  deleteProductFromServer,
  updateProduct,
} = require("../models/products");

const findProductByQuery = async (req, res) => {
  try {
    const { data, total, totalProducts, totalPages } = await findProduct(
      req.query
    );
    const {
      name,
      order = "desc",
      sort = "created_at",
      page = 1,
      limit = 5,
    } = req.query;
    let nextPage = "/products?";
    let prevPage = "/products?";
    if (name) {
      nextPage += `name=${name}&`;
      prevPage += `name=${name}&`;
    }
    if (sort) {
      nextPage += `sort=${sort}&`;
      prevPage += `sort=${sort}&`;
    }
    if (order) {
      nextPage += `order=${order}&`;
      prevPage += `order=${order}&`;
    }
    if (limit) {
      nextPage += `limit=${limit}&`;
      prevPage += `limit=${limit}&`;
    }
    nextPage += `page=${Number(page) + 1}`;
    prevPage += `page=${Number(page) - 1}`;
    const meta = {
      totalProducts,
      totalPages,
      currentPage: Number(page),
      nextPage: Number(page) !== totalPages && nextPage,
      previousPage: Number(page) !== 1 && prevPage,
    };

    successResponsewihMeta(res, 200, data, total, meta);
  } catch (error) {
    const { err, status } = error;
    errorResponseDefault(res, status, err);
  }
};

const postNewProduct = (req, res) => {
  createNewProduct(req.body)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
    })
    .catch((error) => {
      //   console.log(error);
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const deleteProductById = (req, res) => {
  const id = req.params.id;
  deleteProductFromServer(id)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const updateProductById = (req, res) => {
  const id = req.params.id;
  updateProduct(id, req.body)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      console.log(error);
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

module.exports = {
  findProductByQuery,
  postNewProduct,
  deleteProductById,
  updateProductById,
};
