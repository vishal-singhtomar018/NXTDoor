const Listing = require("../models/listing");
const express = require("express");

// index route
module.exports.explore = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    next(err);
  }
};

module.exports.index = async (req, res, next) => {
  try {
    res.render("listings/explore.ejs");
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    res.render("listings/new.ejs");
  } catch (err) {
    next(err);
  }
};

module.exports.Createnewlisting = async (req, res, next) => {
  try {
    if (!req.body.listing) {
      return res.status(400).send("Bad Request: Missing listing data");
    }

    // Initialize amenities if missing
    req.body.listing.amenities = req.body.listing.amenities || {};
    const amenities = req.body.listing.amenities;

    // Normalize amenities to boolean
    for (let key in amenities) {
      if (Array.isArray(amenities[key])) {
        amenities[key] = amenities[key][amenities[key].length - 1];
      }
      amenities[key] = amenities[key] === "true";
    }

    // Handle multiple image uploads
    const images = req.files.map((file, i) => ({
      url: file.path,
      filename: file.filename,
      label: req.body.imageLabels?.[i] || "Apartment",
    }));

    // console.log(images);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = images;

    await newListing.save();

    req.flash("success", "Added");
    res.redirect("/explore");
  } catch (err) {
    next(err);
  }
};

module.exports.showlistings = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    // console.log(listing.images);

    if (!listing) {
      req.flash("error", "The listing you requested does not exist.");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.editListings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "The listing you requested does not exist.");
      return res.redirect("/listings");
    }

    // Check if at least one image exists
    let originalimage = null;
    if (listing.images && listing.images.length > 0 && listing.images[0].url) {
      originalimage = listing.images[0].url.replace(
        "/upload",
        "/upload/w_25/e_blur:300"
      );
    }

    res.render("listings/edit.ejs", { listing, originalimage });
  } catch (err) {
    next(err);
  }
};

module.exports.updatelistings = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", " successfuly Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelistings = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.submit = async (req, res) => {
  try {
    // Ensure the title exists, convert to string and trim spaces
    let countryInput = String(req.body.title || "").trim(); // Convert to string, handle undefined/null

    // Remove unnecessary spaces between words
    countryInput = countryInput.replace(/\s+/g, " "); // Replace multiple spaces with single space

    // Get the city name (or country/place) from the form input
    const placeQuery = countryInput;

    // Check if the placeQuery is not empty
    if (!placeQuery) {
      return res.send("Please provide a valid location.");
    }

    // Perform case-insensitive search across multiple fields using $or
    const allListings = await Listing.find({
      $or: [
        { location: { $regex: placeQuery, $options: "i" } },
        { place: { $regex: placeQuery, $options: "i" } },
        { country: { $regex: placeQuery, $options: "i" } },
        { Type: { $regex: placeQuery, $options: "i" } },
      ],
    });

    // console.log(allListings);

    // Check if there are any listings found
    if (allListings.length === 0) {
      req.flash("error", "No data found");
      return res.redirect("/explore"); // or any route you want to show the flash message
    } else {
      res.render("listings/search.ejs", { allListings });
    }
  } catch (error) {
    console.error("Error while fetching listings:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
};
