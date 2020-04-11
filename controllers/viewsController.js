const Serie = require('../models/serieModel');
const Wine = require('../models/wineModel');

exports.getDashboard = async(req, res) => {
  const data = await Serie.find().populate({path: 'person', path: 'wine'});
  const wines = await Wine.find();

  res.status(200).render("index", {
    title: "Home",
    data,
    wines
  });
};

exports.getFolder = async(req, res) => {
  res.status(200).render("folder", {
    title: 'Folder'
  });
}

exports.getCharts = async(req, res) => {
  const data = await Serie.find().populate({path: 'person', path: 'wine'});
  const date1 = data[0].date.getMonth() + 1;
  const date2 = data[data.length - 1].date.getMonth() + 1;
  
  console.log(date1);
  console.log(date2);

  res.status(200).render("charts", {
    title: "Grafici"
  });
}

exports.getMe = async(req, res) => {
  res.status(200).render("me", {
    title: "Me"
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
