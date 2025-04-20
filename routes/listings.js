const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
    // throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

//Index Route
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// New Route
router.get("/new", isLoggedIn,(req, res) => {
  // if (!req.isAuthenticated()) {
  //   req.flash("error","you must be logged in to create listing")
  //   res.redirect("/login")
  // }
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      // Listing not found, throw custom 404
        req.flash("error","Listings you requested does not exist!")
        res.redirect("/listings");
      // return next(new ExpressError(404, "Listing not found"));
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // let {title,description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
    // listingSchema.validate(req.body);
    // console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    // console.log(listing);
  })
);

//Edit Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    // Listing not found, throw custom 404
      req.flash("error","Listings you requested does not exist!")
      res.redirect("/listings");
    // return next(new ExpressError(404, "Listing not found"));
  }
  res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted");
  res.redirect("/listings");
});

module.exports = router;
