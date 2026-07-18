const dotenv = require("dotenv");
dotenv.config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("results").then((exists) => {
    if (exists) return knex.schema.dropTable("results");

    return knex.schema
      .createTable("results", (table) => {
        table.increments("id").primary();
        table.integer("result").notNullable();
        table.integer("score").notNullable();
        table.timestamps(true, true, true);
      })
      .then(() => {
        return knex.schema.hasTable("rawData").then((exists) => {
          if (exists) return knex.schema.dropTable("rawData");

          return knex.schema.createTable("rawData", (table) => {
            table.increments("id").primary();
            table.integer("time").notNullable();
            table.float("data").notNullable();
            table.integer("resultId").nullable().unsigned().references("id").inTable("results").onDelete("CASCADE");
            table.timestamps(true, true, true);
          });
        });
      });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("rawData").dropTableIfExists("results");
};
