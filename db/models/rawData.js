const { Model } = require("objection");

class RawData extends Model {
  static get tableName() {
    return "rawData";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        time: { type: "integer" },
        data: { type: "number" },
        resultId: { type: "integer" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    };
  }
}

module.exports = RawData;
