// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { knexSnakeCaseMappers } = require("objection");
require("dotenv").config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    // debug: true,
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    async pool() {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
      });
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "mydatabase"}`
      );
      conn.destroy();
      return mysql.createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "mydatabase",
      });
    },
    ...knexSnakeCaseMappers(),
  },
};
