var mongoose = require("mongoose");

// Setup schema
var gallerySchema = mongoose.Schema({
  albumId: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  title: String,
  url: String,
  thumbnailUrl: String,
});

// Export gallery model
var Gallery = (module.exports = mongoose.model("galleries", gallerySchema));
module.exports.get = function (callback, limit) {
  Gallery.find(callback).limit(limit);
};
