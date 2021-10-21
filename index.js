// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");

//Import Data
let data = require("./data");

// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./galleryRoutes");

// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect("mongodb://localhost/gallery", { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db) {
  console.log("Error connecting db");
} else {
  console.log("Db connected successfully");

  // Insert all 5000 photos into MongoDB
  var initialData = data;

  db.collection("galleries").insertMany(initialData, function (error, inserted) {
    if (error) {
      console.error(error);
    } else {
      console.log("Successfully inserted: ", inserted);
    }
  });
}

// Setup server port
var port = process.env.PORT || 6000;

// Enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});

// Send message for default URL
app.get("/", (req, res) => res.send("Hello World with Express"));

// Use Api routes in the App
app.use("/api", apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running Album Gallery on port " + port);
});

module.exports = app;
