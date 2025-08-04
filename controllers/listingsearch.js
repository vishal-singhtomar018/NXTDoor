const Listing=require("../models/listing.js");


module.exports.SearchFilter= async (req, res) => {
  try {
    // Ensure the title exists, convert to string and trim spaces
    let countryInput = String(req.body.title || "").trim(); // Convert to string, handle undefined/null

    // Remove unnecessary spaces between words
    countryInput = countryInput.replace(/\s+/g, " "); // Replace multiple spaces with single space

    // Get the city name (or country/place) from the form input
    const placeQuery = countryInput;

    // Check if the placeQuery is not empty
    if (!placeQuery) {
      req.flash("error","please provide valid listings");
      return res.redirect("/listings/explore");
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
      req.flash("error", "No data found for your search");
      return res.redirect("/listings/explore"); // or any route you want to show the flash message
    } else {
      res.render("listings/search.ejs", { allListings });
    }
  } catch (error) {
    console.error("Error while fetching listings:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
};