const {Schema, model} = require('mongoose');
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        match: /^[A-Za-z]+$/,
        trim: true,
    },
    family: {
        type: String,
        minlength: 3,
        maxlength: 30,
        match: /^[A-Za-z]+$/,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        match: /^[0-9]+$/,
        trim: true,
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 100,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
    },
    birthDay: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        match: /^(13\d{2}|14\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
        trim: true,
    },
    nationalCode: {
        type: String,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]+$/,
        trim: true,
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false,
    },
    isVerifiedPhone: {
        type: Boolean,
        default: false,
    },
    roles: [{
        type: String,
        trim: true
    }],
    permissions: [{
        type: String,
        trim: true
    }],
    isBanned: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
    versionKey: false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
});

userSchema.virtual('fullName').get(function(){
    const firstName = this.name?.trim();
    const lastName = this.family?.trim();
    return lastName ? `${firstName} ${lastName}` : firstName;
});

module.exports = model('User', userSchema);


