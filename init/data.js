const sampleListings = [
  {
    owner: "65f3bfc83d5b1b6a8a5c1234",
    title: "Luxury Apartment in Downtown",
    description: "Enjoy a modern stay in this stylish apartment with breathtaking city views.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1080&q=80", label: "Living Room" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80", label: "Dining Room" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Bedroom" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Kitchen" }
    ],
    price: 14000,
    place: "Indore",
    location: "Vijay nagar",
    country: "United Arab Emirates",
    contact: 9876543210,
    Type: "Apartment",
    Maxpeople: 6,
    Bathrooms: 2,
    Bedrooms: 3,
    amenities: {
      petFriendly: false,
      wifi: true,
      parking: true,
      kitchen: false,
      bachelors: false,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c5678",
    title: "Cozy Cottage",
    description: "A peaceful escape with a stunning lake view, perfect for nature lovers.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Living Room" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80", label: "Dining Room" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Bedroom" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80", label: "Bathroom" }
    ],
    price: 20000,
    place: "Lake Como",
    location: "Lombardy",
    country: "Italy",
    contact: 9832145678,
    Type: "House",
    Maxpeople: 5,
    Bathrooms: 2,
    Bedrooms: 2,
    amenities: {
      petFriendly: true,
      wifi: true,
      parking: false,
      kitchen: true,
      bachelors: true,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c9101",
    title: "Charming Treehouse in the Woods",
    description: "Live among the trees in this unique and cozy treehouse retreat.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Living Room" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Bedroom" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80", label: "Kitchen" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Balcony" }
    ],
    price: 6000,
    place: "Redwood Forest",
    location: "California",
    country: "United States",
    contact: 9745632101,
    Type: "Studio",
    Maxpeople: 3,
    Bathrooms: 1,
    Bedrooms: 1,
    amenities: {
      petFriendly: false,
      wifi: false,
      parking: true,
      kitchen: true,
      bachelors: false,
      furnished: false
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c5678",
    title: "Cozy Lakeview Cottage",
    description: "A peaceful retreat with a stunning lake view, perfect for nature lovers.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80", label: "Living Room" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Bedroom" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80", label: "Dining Room" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Balcony" }
    ],
    price: 15000,
    place: "Lake Como",
    location: "Lombardy",
    country: "Italy",
    contact: 9832145678,
    Type: "House",
    Maxpeople: 5,
    Bathrooms: 2,
    Bedrooms: 2,
    amenities: {
      petFriendly: true,
      wifi: true,
      parking: false,
      kitchen: true,
      bachelors: true,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c9101",
    title: "Modern Studio in City Center",
    description: "Compact and stylish studio located in the heart of the city, close to all amenities.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Living Area" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Dining Area" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80", label: "Bathroom" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Kitchen" }
    ],
    price: 16000,
    place: "Central Square",
    location: "London",
    country: "United Kingdom",
    contact: 9745632101,
    Type: "Studio",
    Maxpeople: 2,
    Bathrooms: 1,
    Bedrooms: 1,
    amenities: {
      petFriendly: false,
      wifi: true,
      parking: false,
      kitchen: true,
      bachelors: false,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c4321",
    title: "Spacious Shared Room in Downtown",
    description: "A well-furnished shared room in a lively neighborhood, ideal for young professionals.",
    images: [
      { filename: "image1", url: "https://plus.unsplash.com/premium_photo-1717014210742-b3f268ff3b6e?w=600&q=80", label: "Room View" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1080&q=80", label: "Living Room" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Desk Space" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Common Area" }
    ],
    price: 4500,
    place: "Brooklyn",
    location: "New York City",
    country: "United States",
    contact: 9123456789,
    Type: "Shared Room",
    Maxpeople: 2,
    Bathrooms: 1,
    Bedrooms: 1,
    amenities: {
      petFriendly: false,
      wifi: true,
      parking: false,
      kitchen: true,
      bachelors: true,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c6789",
    title: "Luxury Beachfront Villa",
    description: "A luxurious villa with a private beach, offering stunning ocean views.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Beach View" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Bedroom" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80", label: "Lounge" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Terrace" }
    ],
    price: 4500,
    place: "Waikiki Beach",
    location: "Hawaii",
    country: "United States",
    contact: 9988776655,
    Type: "House",
    Maxpeople: 8,
    Bathrooms: 3,
    Bedrooms: 4,
    amenities: {
      petFriendly: true,
      wifi: true,
      parking: true,
      kitchen: true,
      bachelors: false,
      furnished: true
    }
  },
  {
    owner: "65f3bfc83d5b1b6a8a5c2222",
    title: "Alpine Chalet with Mountain Views",
    description: "A cozy retreat in the Swiss Alps, perfect for skiing enthusiasts and nature lovers.",
    images: [
      { filename: "image1", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80", label: "Snow View" },
      { filename: "image2", url: "https://images.unsplash.com/photo-1604004218771-05c55db4f9f4?w=600&q=80", label: "Fireplace" },
      { filename: "image3", url: "https://images.unsplash.com/photo-1619989652700-9984844cb0ea?w=600&q=80", label: "Bedroom" },
      { filename: "image4", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80", label: "Dining Area" }
    ],
    price: 28000,
    place: "Swiss Alps",
    location: "Zermatt",
    country: "Switzerland",
    contact: 9345678901,
    Type: "Studio",
    Maxpeople: 5,
    Bathrooms: 2,
    Bedrooms: 2,
    amenities: {
      petFriendly: true,
      wifi: true,
      parking: true,
      kitchen: false,
      bachelors: true,
      furnished: true
    }
  }
];

module.exports = { data: sampleListings };
