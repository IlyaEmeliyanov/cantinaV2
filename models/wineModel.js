const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: [true, 'The wine must have a name'],
    },
    price: {
        type: Number,
        min: 3,
        required: [true, 'The wine must have a price']
    }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});


const Wine = mongoose.model('Wine', wineSchema);

module.exports = Wine;