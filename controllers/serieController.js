const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const Serie = require('../models/serieModel');

exports.getSeries = catchAsync(async(req, res, next) => {
    const data = await Serie.find().populate({path: 'person', path: 'wine'});
    if(!data) return next(new AppError('There is no data in the database', 400));
    res.json({
        status: 'success',
        data
    });
});

exports.getSerie = catchAsync(async(req, res, next) => {
    const data = await Serie.findById(req.params.id).populate({path: 'person', path: 'wine'});
    console.log(data);
    if(!data) next(new AppError('No document found with that ID', 404));
    res.json({
        status: 'success',
        data
    });
});

exports.postSerie = catchAsync(async(req, res, next) => {
    const data = await new Serie(req.body);

    await data.save();
    res.json({
        status: 'success',
        data
    });
});

exports.updateSerie = catchAsync(async(req, res, next) => {
    const data = await Serie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}).populate({path: 'person'});
    if(!data) return new AppError('No document found with that ID', 404);
    res.json({
        status: 'success',
        data
    });
});

exports.deleteSerie = catchAsync(async(req, res, next) => {
    const data = await Serie.findByIdAndDelete(req.params.id);
    if(!data) return new AppError('No document found with that ID', 404);
});

exports.getSerieByDate = catchAsync(async(req, res, next) => {
    const {year, month, day} = req.params;
    if(!year || !month || !day) return next(new AppError('You must provide a day, a month and a year', 404));
    const date = new Date(`${year}-${month}-${day}`);
    const nextDate = new Date(date);
    nextDate.setHours(nextDate.getHours() + 23);
    const aggregate = await Serie.aggregate([
        {
            $match: { date: { $gte: date, $lte: nextDate } }
        },
        {   
            $group: {
                _id: { $toLower: '$wine' },
                qty: { $sum: '$qty' }
            }
        }
    ]);

    res.json({
        status: 'success',
        data: {
            aggregate
        }
    });

});

exports.getMonthlyPlan = catchAsync(async(req, res, next) => {
    const {year, month} = req.params;

    if(!year || !month) return next(new AppError('You must provide a day, a month and a year', 404));

    const aggregate = await Serie.aggregate([
        {
            $match: { date: { $gte: new Date(`${year}-${month}-01`), $lte: new Date(`${year}-${month}-31`) } }
        },
        {
        $group: 
            {
                _id: { $toLower: '$wine' },
                numWine: { $sum: 1 },
                person: { $push: '$person' }
            }
        },
    ]);

    res.json({
        status: 'success',
        data: {
            aggregate
        }
    });

});
