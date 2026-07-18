require("dotenv").config();
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const modelPath = path.join(__dirname, "../public/model/model.json");

const RawData = require("../db/models/rawData");
const Results = require("../db/models/results");

const kssLabel = [
  "Extremely alert",
  "Very alert",
  "Alert",
  "Rather alert",
  "Neither alert nor sleepy",
  "Some signs of sleepiness",
  "Sleepy, but no effort to keep awake",
  "Sleepy, but some effort to keep awake",
  "Very sleepy, great effort to keep awake, fighting sleep",
  "Extremely sleepy, can't keep awake",
];

const insert = async (req, res, next) => {
  // insert data from request to database
  try {
    const rawData = await RawData.query().insert({
      data: parseFloat(req.body.data),
      time: req.body.time,
    });
    return res.status(201).json({
      status: "success",
      data: rawData,
    });
  } catch (err) {
    next(err);
  }
};

const getForSocket = async () => {
  // show data to frontend through socket
  try {
    const rawData = await RawData.query().orderBy("createdAt", "desc").limit(50);

    return rawData;
  } catch (err) {
    console.log(err);
  }
};

const predict = async () => {
  // classify the data using tensorflow
  // save the classified data to the database
  // return the classified data
  try {
    const rawData = await RawData.query().where("resultId", null).orderBy("createdAt", "desc").limit(24);

    // load the model
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    // prepare the data
    const data = [rawData.map((data) => data.data)];
    const ids = rawData.map((data) => data.id);

    if (data[0].length < 24) return console.log(`Data is not enough, only ${data[0].length} data available`);

    // convert shape of data to [null, 24]
    const tensorData = tf.tensor(data).reshape([1, 24]);
    // classify the data
    const classifiedData = model.predict(tensorData).dataSync();
    // save the classified data to the database
    const predicted = Math.round(classifiedData[0]);
    const kss = predicted === 1 ? Math.floor(Math.random() * (10 - 6 + 1) + 6) : Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const classifiedDataToSave = {
      result: predicted,
      score: kss,
    };
    const result = await Results.query().insert(classifiedDataToSave);
    await RawData.query().update({ resultId: result.id }).whereIn("id", ids);
    return {
      status: "success",
      data: {
        predict: predicted,
        kss: {
          score: kss,
          label: kssLabel[kss - 1],
        },
      },
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  insert,
  getForSocket,
  predict,
};
