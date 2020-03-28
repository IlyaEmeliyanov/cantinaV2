const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const Wine = require("../models/wineModel");

const _ = require('lodash');

exports.getWines = catchAsync(async (req, res) => {
  let wines = await Wine.find();
  res.json({
    status: "success",
    data: wines
  });
});

exports.getWine = catchAsync(async(req, res) => {
  const wine = await Wine.findOne({name: req.params.name});
  res.json({
    status: "success",
    data: wine
  });
});

exports.postWine = catchAsync(async (req, res) => {
  const wine = await Wine.create(req.body);
  res.json({
    status: "success",
    data: wine
  });
});