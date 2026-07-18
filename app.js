require("dotenv").config();
const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  url = process.env.URL || "http://localhost:3000",
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  db = require("./db/db"),
  http = require("http"),
  DataController = require("./controllers/data"),
  server = http.createServer(app),
  io = require("socket.io")(server);

db();

app.use(bodyParser.json()); // parse application/json
app.use(
  bodyParser.urlencoded({
    extended: false,
    parameterLimit: 100000,
    limit: "900mb",
  })
); // parse application/x-www-form-urlencoded

app.use(express.static(__dirname + "/public")); // route for public folder
app.set("view engine", "ejs"); // set ejs as view engine
app.use(cookieParser());
app.use(require("./routes")); // call all routes from routes/index.js
app.use(function onError(err, req, res, next) {
  console.log(err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}); // catch error and send response

io.on("connection", (socket) => {
  console.log("Client connected");

  // Listen for data updates every 300 ms
  setInterval(async () => {
    const newData = await DataController.getForSocket();
    socket.emit("update", newData);
  }, 300); // -> 300 ms

  // listen for data predict every 5 second
  setInterval(async () => {
    const predict = await DataController.predict();
    socket.emit("predict", predict);
  }, 5000); // -> 5 second
});

server.listen(port, () => {
  console.log("Listening at address " + url);
});
