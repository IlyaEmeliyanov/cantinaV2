const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
        maxlength: 10,
        required: [true, 'A user must have a name'],
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: [true, 'The email is already in use'],
        validate: [validator.isEmail, 'The email must be a valid email']
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: [true, 'A user must have a password'],
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(val){
                return val === this.password;
            },
            message: 'Passwords have to be equal'
        },
        minlength: 4,
        maxlength: 20,
        required: [true, 'A user must provide a confirmation of the password'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;