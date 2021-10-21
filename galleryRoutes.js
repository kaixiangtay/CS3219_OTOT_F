// Initialize express router
let router = require("express").Router();

// Set default API response
router.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to Gallery!",
  });
});

// Import gallery controller
var galleryController = require("./galleryController");

// gallery routes
router.route("/gallery/photos").get(galleryController.allPhotos);
router.route("/gallery/photos/:album_id").get(galleryController.selectedPhotos);

// Export API routes
module.exports = router;
