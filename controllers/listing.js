const Listing = require("../models/listing");
const express = require("express");
const axios = require("axios");
// console.log(client.find());

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
    const allListings = await Listing.find({});
    res.render("listings/explore.ejs",{allListings});
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

    // Normalize amenities
    req.body.listing.amenities = req.body.listing.amenities || {};
    const amenities = req.body.listing.amenities;
    for (let key in amenities) {
      if (Array.isArray(amenities[key])) {
        amenities[key] = amenities[key][amenities[key].length - 1];
      }
      amenities[key] = amenities[key] === "true";
    }

    // Handle multiple images
    const images = req.files.map((file, i) => ({
      url: file.path,
      filename: file.filename,
      label: req.body.imageLabels?.[i] || "Apartment",
    }));

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = images;

    // ✅ Geocode neighborhood + city + country with OpenCage
    if (
      req.body.listing.location &&
      req.body.listing.city &&
      req.body.listing.country
    ) {
      const query = `${req.body.listing.location}, ${req.body.listing.city}, ${req.body.listing.country}`;
      const apiKey = process.env.OPENCAGE_API_KEY; // Store your free API key in .env

      const geoRes = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: query,
            key: apiKey,
            limit: 1,
          },
        }
      );

      if (geoRes.data.results.length > 0) {
        newListing.latitude = geoRes.data.results[0].geometry.lat;
        newListing.longitude = geoRes.data.results[0].geometry.lng;
      }
    }

    await newListing.save();
    req.flash("success", "Listing Added");
    res.redirect("/listings/explore");
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

module.exports.RendereditListings = async (req, res, next) => {
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
  try {
    let { id } = req.params;

    // Update listing fields
    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true }
    );

    // Handle images if uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, i) => ({
        url: file.path,
        filename: file.filename,
        label: req.body.imageLabels?.[i] || "Apartment",
      }));
      listing.images = images;
      await listing.save();
    }

    // ✅ Re-geocode location + city + country if updated
    if (
      req.body.listing.location &&
      req.body.listing.city &&
      req.body.listing.country
    ) {
      const query = `${req.body.listing.location}, ${req.body.listing.city}, ${req.body.listing.country}`;
      let lat, lon;

      try {
        // Try OpenCage first
        const apiKey = process.env.OPENCAGE_API_KEY;
        const geoRes = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: { q: query, key: apiKey, limit: 1 },
          }
        );

        if (geoRes.data.results.length > 0) {
          lat = geoRes.data.results[0].geometry.lat;
          lon = geoRes.data.results[0].geometry.lng;
        }
      } catch (err) {
        console.warn(
          "OpenCage failed, falling back to Nominatim:",
          err.message
        );
      }

      // Fallback → Nominatim
      if (!lat || !lon) {
        try {
          const nominatimRes = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: { q: query, format: "json", limit: 1 },
              headers: { "User-Agent": "YourAppName/1.0" },
            }
          );

          if (nominatimRes.data.length > 0) {
            lat = nominatimRes.data[0].lat;
            lon = nominatimRes.data[0].lon;
          }
        } catch (err) {
          console.error("Nominatim also failed:", err.message);
        }
      }

      // Save if we got coordinates
      if (lat && lon) {
        listing.latitude = lat;
        listing.longitude = lon;
        await listing.save();
      }
    }

    req.flash("success", "Successfully Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deletelistings = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfuly Deleted");
    res.redirect("/listings/explore");
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
      return res.redirect("/listings/explore"); // or any route you want to show the flash message
    } else {
      res.render("listings/search.ejs", { allListings });
    }
  } catch (error) {
    console.error("Error while fetching listings:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
};



module.exports.MyListing = async (req, res, next) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in to view your listings.");
      return res.redirect("/login");
    }

    const myListings = await Listing.find({ owner: req.user._id });
    res.render("listings/myListings.ejs", { myListings }); // pass to template
  } catch (err) {
    next(err);
  }
};


module.exports.profile =async (req, res, next) => {
    const myListings = await Listing.find({ owner: req.user._id });
    res.render("listings/Profile.ejs", { user: res.locals.currUser ,myListings});
};
