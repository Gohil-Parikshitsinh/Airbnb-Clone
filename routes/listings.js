const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage }) //to upload files in the cloud storage


//Index route and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListings)
);
// .post(upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
// })



// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Upadte and Delete Route
router.route("/:id")
.get(
  wrapAsync(listingController.showListings)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'), 
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn, isOwner, listingController.destroyListing);


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
