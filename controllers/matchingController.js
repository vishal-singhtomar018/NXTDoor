const Listing = require("../models/listing");
const express = require("express");



module.exports.FilterSearch = async (req, res) => {
  const { min, max, query } = req.query;
  const filter = {};

  // Price filter
  if (!isNaN(parseInt(min)) && !isNaN(parseInt(max))) {
    filter.price = { $gte: parseInt(min), $lte: parseInt(max) };
  }

  // Location/Type filter
  if (query) {
    console.log("Search term:", query);
    const regex = new RegExp(query, "i");
    filter.$or = [
      { location: regex },
      { place: regex },
      { country: regex },
      { Type: regex },
    ];
  }

  try {
    const listings = await Listing.find(filter);
    res.render("listings/FilterSearch.ejs", { listings, query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};