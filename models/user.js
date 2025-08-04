const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    budget: { type: Number }, // Can be set later
    preferredLocation: { type: String },
    preferredType: { type: String, enum: ["Apartment", "House", "Shared Room", "Studio"] },
    amenities: {
        petFriendly: Boolean,
        wifi: Boolean,
        parking: Boolean,
        kitchen:Boolean,
        bachelors:Boolean,
        furnished: Boolean, 
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
