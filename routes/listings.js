const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js")


//Index route and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
  validateListing,
  wrapAsync(listingController.createListings)
);



// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Upadte and Delete Route
router,route("/:id")
.get(
  wrapAsync(listingController.showListings)
)
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn, isOwner, listingController.destroyListing);


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
