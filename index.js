const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const clc = require("cli-color");

const info = clc.cyanBright;
const error = clc.redBright;

const {
  port,
  DATABASE_DEV,
  DATABASE_PROD,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV
} = require("./config/config.json");
const serieRouter = require("./router/serieRoutes");
const authRouter = require("./router/authRoutes");
const wineRouter = require("./router/wineRoutes");
const viewsRouter = require('./router/viewsRoutes');


//Config middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


//View Engine PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


//Config
const AppError = require("./utils/AppError");

const bodyParser = require("body-parser");

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};


app.use(bodyParser.urlencoded(options));
app.use(express.json());




app.use("/", authRouter);
app.use("/serie", serieRouter);
app.use("/wine", wineRouter);
app.use("/", viewsRouter);


//Db Config
console.log(info(`You are in ${process.env.NODE_ENV} mode👽`));

if (process.env.NODE_ENV === "production") {
  const dbURI = DATABASE_PROD.replace("<username>", DB_USER).replace(
    "<password>",
    DB_PASSWORD
  );
  mongoose
    .connect(dbURI, options)
    .then(() => console.log(info("Connected to DB", dbURI)))
    .catch(err => console.log(error("Error: ", err.message)));

  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else{
  mongoose
    .connect(DATABASE_DEV, options)
    .then(() => console.log(info("Connected to DB", DATABASE_DEV)))
    .catch(err => console.log(error("Error: ", err.message)));
}

//Capturing errors    
app.all("*", (req, res, next) => {
  next(new AppError(`Invalid path ${req.path}`));
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

const connectionPort = process.env.PORT || port;

app.listen(connectionPort, () =>
  console.log(info("Connected to port:", connectionPort))
);
