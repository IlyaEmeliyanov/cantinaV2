const Serie = require("../models/serieModel");
const Wine = require("../models/wineModel");

exports.getDashboard = async (req, res) => {
  const wines = await Wine.find();

  let queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "year", "month", "day"];
  excludedFields.forEach((field) => delete queryObj[field]);

  if (req.query.year) {
    const now = new Date();

    let year = parseInt(req.query.year);
    let month = parseInt(req.query.month)-1 || now.getMonth();
    let day = parseInt(req.query.day) || 1;

    const queryDate = new Date(year, month, day, 0, 0, 0, 0);

    const queryDateObj = { date: { $lte: now, $gte: queryDate } };

    queryObj = { ...queryObj, ...queryDateObj };
  }

  // 1.Filtering
  let query = Serie.find(queryObj).populate({ path: "person", path: "wine" });

  // 2.Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-date");
  }

  // 3.Pagination
  const page = req.query.page * 1 || 1;
  const limitValue = req.query.limit * 1 || 10;
  const skipValue = (page - 1) * limitValue;
  query = query.skip(skipValue).limit(limitValue);

  const data = await query;

  console.log(data);

  res.status(200).render("index", {
    title: "Home",
    data,
    wines,
  });
};

exports.getFolder = async (req, res) => {
  res.status(200).render("folder", {
    title: "Folder",
  });
};

exports.getCharts = async (req, res) => {
  const data = await Serie.find().populate({ path: "person", path: "wine" });
  const date1 = data[0].date.getMonth() + 1;
  const date2 = data[data.length - 1].date.getMonth() + 1;

  console.log(date1);
  console.log(date2);

  res.status(200).render("charts", {
    title: "Grafici",
  });
};

exports.getMe = async (req, res) => {
  res.status(200).render("me", {
    title: "Me",
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
};
