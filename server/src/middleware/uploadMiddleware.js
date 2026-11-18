const multer = require("multer");

// Shared image storage and validation
const imageStorage = multer.memoryStorage();

const MAX_IMAGE_MB = 3;

const imageLimits = {
  fileSize: MAX_IMAGE_MB * 1024 * 1024,
};

const imageFileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png"].includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only JPG or PNG images are allowed"));
};

// Registration image upload
const registrationUpload = multer({
  storage: imageStorage,
  limits: imageLimits,
  fileFilter: imageFileFilter,
}).fields([
  { name: "nicFrontImage", maxCount: 1 },
  { name: "nicBackImage", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

// Job photo upload (also used for the profile photo)
const jobPhotoUpload = multer({
  storage: imageStorage,
  limits: imageLimits,
  fileFilter: imageFileFilter,
}).single("photo");

// Common upload error handler
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (!err) return next();

      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? `Image must be ${MAX_IMAGE_MB}MB or smaller`
          : err.message;

      return res.status(400).json({
        success: false,
        message,
      });
    });
  };
};

const uploadRegistrationFiles = handleUpload(registrationUpload);

const uploadJobPhoto = handleUpload(jobPhotoUpload);

module.exports = {
  uploadRegistrationFiles,
  uploadJobPhoto,
};