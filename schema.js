const Joi = require("joi");


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    place: Joi.string().required(),
    price: Joi.number().required().min(0),

    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().allow("",null),
        filename: Joi.string().allow("", null)
      })
    ).min(1).required(), // Require at least 1 image

    Type: Joi.string().valid("Apartment", "House", "Shared Room", "Studio").required(),
    Maxpeople: Joi.number().required().min(0),
    Bathrooms: Joi.number().required().min(0),
    Bedrooms: Joi.number().required().min(0),

    amenities: Joi.object({
      petFriendly: Joi.boolean(),
      wifi: Joi.boolean(),
      parking: Joi.boolean(),
      kitchen: Joi.boolean(),
      bachelors: Joi.boolean(),
      furnished: Joi.boolean()
    })
    .min(1) // At least one amenity must be provided
    .required()
  }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        Comment: Joi.string().required()
    }).required()
});
