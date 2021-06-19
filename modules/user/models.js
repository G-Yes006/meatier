const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;


const user = {
    _id: { type: objectId, auto: true },
    fname: String,
    lname: String,
    role: [String],
    username: String,
    password: String,
    email: String,
    countryCode: Number,
    phone: Number,
    emailVerified: { type: Boolean, default: 0 },
    phoneVerified: { type: Boolean, default: 0 },
    org: String,
    securityCode: Number,
    createdDate: Date,
    updatedDate: Date,
    status: { type: Boolean, default: 1 }
};
const userSchema = new Schema(user, { versionKey: false });

userSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        console.log(currentDate);
        this.createdDate = currentDate;
    }
    next();
});

userSchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre User Update");
    this.updatedDate = new Date();
    next();
});


// User Details
const userDetails = {
    _id: { type: objectId, auto: true },
    userId: { type: objectId, required: true },
    address: String,
    location: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    region: String,
    timezone: String,
    geoLocation: String,
    createdDate: Date,
    updatedDate: Date
};
const userDetailsSchema = new Schema(userDetails, { versionKey: false });

userDetailsSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
});
userDetailsSchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre User DetailsSchema Update");
    this.updatedDate = new Date();
    next();
});

// User Group
const userGroup = {
    _id: { type: objectId, auto: true },
    userId: { type: objectId, required: true },
    group: String,
    subGroup: [String],
    createdDate: Date,
    updatedDate: Date
};
const userGroupSchema = new Schema(userGroup, { versionKey: false });

userGroupSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
});
userGroupSchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre User DetailsSchema Update");
    this.updatedDate = new Date();
    next();
});

// User Profile Pics
const userProfilePics = {
    _id: { type: objectId, auto: true },
    userId: { type: objectId, required: true },
    profilePics: String,
    createdDate: Date,
    updatedDate: Date
};
const userProfilePicsSchema = new Schema(userProfilePics, { versionKey: false });

userProfilePicsSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
});
userProfilePicsSchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre User Profile Pics Schema Update");
    this.updatedDate = new Date();
    next();
});

module.exports = {
    Auth: mongoose.model("user", userSchema),
    Details: mongoose.model("userDetails", userDetailsSchema),
    Group: mongoose.model("userGroup", userGroupSchema),
    ProfilePics: mongoose.model("userProfilePics", userProfilePicsSchema)
};