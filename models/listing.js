const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  images: [
    {
      url: String,
      filename: String,
      label: String,
    },
  ],
  price: { type: Number, required: true },
  city: String,
  location: String,
  country: String,
  contact: Number,
  Type: { type: String, enum: ["Apartment", "House", "Shared Room", "Studio"] },
  Maxpeople: Number,
  Bathrooms: Number,
  Bedrooms: Number,
  latitude: Number,
  longitude: Number,
  amenities: {
    type: Object,
    default: {
      petFriendly: false,
      wifi: false,
      parking: false,
      kitchen: false,
      bachelors: false,
      furnished: false,
    },
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });   // <-- Add this


// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
