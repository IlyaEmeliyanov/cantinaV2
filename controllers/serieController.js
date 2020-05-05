const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const Serie = require("../models/serieModel");
const Wine = require("../models/wineModel");

const _ = require("lodash");

exports.getSeries = catchAsync(async (req, res, next) => {
  let queryObj = { ...req.query };
  const excludedFields = [
    "page",
    "sort",
    "limit",
    "date",
    "year",
    "month",
    "day",
  ];
  excludedFields.forEach((field) => delete queryObj[field]);

  // 1.Filtering
  if (req.query.year) {
    const now = new Date();

    let year = parseInt(req.query.year);
    let month = parseInt(req.query.month) - 1 || now.getMonth();
    let day = parseInt(req.query.day) || 1;

    const queryDate = new Date(year, month, day, 0, 0, 0, 0);

    console.log(now > queryDate);

    const queryDateObj = { date: { $lte: now, $gte: queryDate } };

    queryObj = { ...queryObj, ...queryDateObj };
    console.log(queryObj);
  }

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

  if (!data) return next(new AppError("There is no data in the database", 400));

  res.json({
    status: "success",
    data,
  });
});

exports.getSerie = catchAsync(async (req, res, next) => {
  const data = await Serie.findById(req.params.id).populate({
    path: "person",
    path: "wine",
  });

  if (!data) next(new AppError("No document found with that ID", 404));
  res.json({
    status: "success",
    data,
  });
});

exports.postSerie = catchAsync(async (req, res, next) => {
  const data = await new Serie(req.body);

  await data.save();
  res.json({
    status: "success",
    data,
  });
});

exports.updateSerie = catchAsync(async (req, res, next) => {
  const data = await Serie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({ path: "person" });
  if (!data) return new AppError("No document found with that ID", 404);
  res.json({
    status: "success",
    data,
  });
});

exports.deleteSerie = catchAsync(async (req, res, next) => {
  const data = await Serie.findByIdAndDelete(req.params.id);
  if (!data) return new AppError("No document found with that ID", 404);
  res.json({
    status: "success",
    data,
  });
});

exports.getSerieByDate = catchAsync(async (req, res, next) => {
  const { year, month, day } = req.params;
  if (!year || !month || !day)
    return next(
      new AppError("You must provide a day, a month and a year", 404)
    );
  const date = new Date(`${year}-${month}-${day}`);
  const nextDate = new Date(date);
  nextDate.setHours(nextDate.getHours() + 23);
  const aggregate = await Serie.aggregate([
    {
      $match: { date: { $gte: date, $lte: nextDate } },
    },
  ]);

  res.json({
    status: "success",
    data: {
      aggregate,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  try {
    const { year, month } = req.params;
    if (!year || !month)
      return next(
        new AppError("You must provide a day, a month and a year", 404)
      );

    const aggregate = await Serie.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-31`),
          },
        },
      },
      {
        $group: {
          _id: { $toObjectId: "$wine" },
          numWine: { $sum: 1 },
          wine: { $push: "$wine" },
        },
      },
    ]);

    res.json({
      status: "success",
      data: {
        aggregate,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
});

exports.getSerieByWine = catchAsync(async (req, res, next) => {
  const { year, month, day } = req.query;
  const {wine} = req.params;

  let yearValue = year || new Date().getFullYear();
  let monthValue = month || 1;
  let dayValue = day || 1;
  

  const now = new Date();
  const date = new Date(`${yearValue}-${monthValue}-${dayValue}`);

  const wineId = (await Wine.findOne({name: wine}))._id;

  console.log(date);
  console.log(now);

  const aggregate = await Serie.aggregate([
    {
      $match: { date: { $gte: date, $lte: now }, wine: wineId},
    },
  ]);

  console.log(aggregate);

  res.json({
    status: 'success',
    data: aggregate 
  });

});
