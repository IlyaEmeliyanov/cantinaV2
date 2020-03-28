const Serie = require('../models/serieModel');
const Wine = require('../models/wineModel');

exports.getDashboard = async(req, res) => {
  const data = await Serie.find().populate({path: 'person', path: 'wine'});
  const wines = await Wine.find();

  res.status(200).render("index", {
    title: "Uve Vettoretti",
    data,
    wines
  });
};

exports.getCharts = async(req, res) => {

  res.status(200).render("charts", {
    title: "Grafici"
  });
}

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Login"
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Signup"
  });
};
