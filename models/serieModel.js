const mongoose = require('mongoose');

const serieSchema = new mongoose.Schema({
    wine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wine',
        required: [true, 'The serie must have a wine']
    },
    qty: {
        type: Number,
        required: [true, 'The serie must have a quantity'],
        min: 1,
        max: 1000
    },
    date: {
        type: Date,
        default: Date.now()
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    purpose: {
        type: String,
        required: [true, 'The serie must have a purpose'],
    },
    comment: {
        type: String,
    },
    destinationStr: {
        type: String,
        required: [true, 'The serie must have a destination']
    }
}, { toJSON: {virtuals: true}, toObject: {virtuals: true}});

serieSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'person',
        select: '-__v -role -password -passwordConfirm -_id'
    });
    next();
});

serieSchema.pre('save', function(next){

    console.log(typeof this.wine);
    console.log(typeof this.person);
    
    this.wine = mongoose.Types.ObjectId(this.wine);
    this.person = mongoose.Types.ObjectId(this.person);

    next();
});

const Serie = mongoose.model('Serie', serieSchema);

module.exports = Serie;