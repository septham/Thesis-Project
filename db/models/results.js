const { Model } = require("objection");

class Results extends Model {
  static get tableName() {
    return "results";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["result", "score"],
      properties: {
        id: { type: "integer" },
        result: { type: "integer" },
        score: { type: "integer" },
        createAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    };
  }
}

module.exports = Results;
