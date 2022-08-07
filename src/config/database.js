const psql = require("pg");
const { Pool } = psql;

const db = new Pool({
  max: 20,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const dbConn = async () => {
  try {
    await db.connect();
    console.log("DB connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

module.exports = { db, dbConn };
