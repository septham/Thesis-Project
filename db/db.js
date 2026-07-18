const Knex = require("knex");
const { Model } = require("objection");
const knexfile = require("./knexfile");

function setupDb() {
  const knex = Knex(knexfile.development);
  Model.knex(knex);

  return knex;
}

module.exports = setupDb;
