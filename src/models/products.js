const { db } = require("../config/database");

const findProduct = (query) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      order = "desc",
      sort = "created_at",
      page = 1,
      limit = 5,
    } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let totalParam = [];
    let arr = [];
    let totalQuery =
      "select count(*) as total_products from products p join uom u on p.uom_id = u.id WHERE p.on_deleted = false";
    let sqlQuery =
      "SELECT p.id ,p.code, p.name , p.price , p.description ,u.name as uom , p.created_at, p.on_deleted FROM products p JOIN uom u on p.uom_id = u.id WHERE p.on_deleted = false";
    if (!name) {
      sqlQuery += " order by p." + sort + " " + order + " LIMIT $1 OFFSET $2";
      arr.push(parseInt(limit), offset);
    }
    if (name) {
      sqlQuery +=
        " and lower(p.name) like lower('%' || $1 || '%') order by p." +
        sort +
        " " +
        order +
        " LIMIT $2 OFFSET $3";
      totalQuery += " and lower(p.name) like lower('%' || $1 || '%')";
      arr.push(name, parseInt(limit), offset);
      totalParam.push(name);
    }
    db.query(sqlQuery, arr)
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        // console.log("bawah");
        db.query(totalQuery, totalParam)
          .then((result) => {
            response.totalProducts = Number(result.rows[0]["total_products"]);
            response.totalPages = Math.ceil(
              response.totalProducts / Number(limit)
            );
            resolve(response);
          })
          .catch((err) => {
            reject({ status: 500, err });
          });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const createNewProduct = (body) => {
  return new Promise((resolve, reject) => {
    const { name, uom_id, price, description, code } = body;
    const sqlQuery =
      "INSERT INTO products (name, uom_id, price, description,code, created_at, on_deleted) VALUES ($1, $2, $3, $4, $5, now(), false) RETURNING *";
    db.query(sqlQuery, [name, uom_id, price, description, code])
      .then(({ rows }) => {
        const response = {
          data: rows[0],
          // msg: "New product succesfully added!",
        };
        resolve(response);
      })
      .catch((err) => reject({ status: 500, err }));
  });
};

const deleteProductFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE products SET on_deleted=true where id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Product with id ${id} was successfully deleted`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const updateProduct = (id, body) => {
  return new Promise((resolve, reject) => {
    const { name, uom_id, price, description, code } = body;
    const sqlQuery =
      "UPDATE products SET name= COALESCE($1, name), uom_id= COALESCE($2, uom_id), price= COALESCE($3, price), description= COALESCE($4, description), code= COALESCE($5, code) WHERE id=$6 RETURNING *";
    db.query(sqlQuery, [name, uom_id, price, description, code, id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Product with id ${id} has been updated`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  findProduct,
  createNewProduct,
  deleteProductFromServer,
  updateProduct,
};
