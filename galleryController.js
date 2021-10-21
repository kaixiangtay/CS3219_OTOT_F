Gallery = require("./galleryModel");

const redis = require("redis");
const redisClient = redis.createClient();
const DEFAULT_EXPIRATION = 3600;

// Handle view all Photos
exports.allPhotos = function (req, res) {
  var cacheKey = `?allPhotos`;

  redisClient.get(cacheKey, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      console.log("Inside Cache: " + cacheKey);
      res.send(JSON.parse(data));
    } else {
      console.log("Caching in progress: " + cacheKey);
      
      Gallery.get(function (err, Photos) {
        if (err) {
          return res.json({
            status: "error",
            message: err,
          });
        }
        redisClient.setex(
          cacheKey,
          DEFAULT_EXPIRATION,
          JSON.stringify(Photos),
          (err, reply) => {
            if (err) {
              console.log(err);
            } else {
              console.log(reply);
            }
          }
        );
        return res.json(Photos);
      });
    }
  });
};

// Handle view selected Photos
exports.selectedPhotos = function (req, res) {
  var albumId = req.params.album_id;
  var cacheKey = `Photos?albumId=${albumId}`;

  redisClient.get(cacheKey, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      console.log("Inside cache: " + cacheKey);
      res.send(JSON.parse(data));
    } else {
      console.log("Caching in progress: " + cacheKey);

      Gallery.find({ albumId: albumId })
        .then((response) => {
          redisClient.setex(
            cacheKey,
            DEFAULT_EXPIRATION,
            JSON.stringify(response),
            (err, reply) => {
              if (err) {
                console.log(err);
              } else {
                console.log(reply);
              }
            }
          );
          return res.json(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
