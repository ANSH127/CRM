const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        },
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect email');
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
        throw Error('Incorrect password');
    }

    return user;
}
userSchema.statics.signup = async function(name, email, password) {
    if (!name || !email || !password) {
        throw Error('All fields must be filled');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ name, email, password: hash });

    return user;
}




const UserModel = mongoose.model('User', userSchema);




module.exports = UserModel;