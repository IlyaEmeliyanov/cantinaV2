const Serie = require("../models/serieModel");
const Wine = require("../models/wineModel");
const User = require('../models/userModel');

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

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

  let wineId = '';

  if(req.query){
    let {wine} = req.query;
  
    const res = await Wine.findOne({name: wine});
    console.log(res);
  }

  res.status(200).render("charts", {
    title: "Grafici",
    wineId
  });
};

exports.getMe = async (req, res) => {

  const token = req.headers.cookie.split('=')[1];

  const {value} = await jwt.decode(token);

  const {role, name, email} = await User.findById(value);

  const data = await Serie.find({person: mongoose.Types.ObjectId(value)}).populate({path: 'person', path: 'wine'});

  data.reverse();

  res.status(200).render("me", {
    title: "Me",
    role,
    name,
    email,
    data
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
