const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }

module.exports.renderNewForm = (req, res) => {
  // if (!req.isAuthenticated()) {
  //   req.flash("error","you must be logged in to create listing")
  //   res.redirect("/login")
  // }
  res.render("listings/new.ejs");
}


module.exports.showListings = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      // Listing not found, throw custom 404
      req.flash("error", "Listings you requested does not exist!");
      res.redirect("/listings");
      // return next(new ExpressError(404, "Listing not found"));
    }
    // console.log(listing);

    res.render("listings/show.ejs", { listing });
  }



module.exports.createListings = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url);
    
    // let {title,description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
    // listingSchema.validate(req.body);
    // console.log(result);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    // console.log(listing);
  }

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    // Listing not found, throw custom 404
    req.flash("error", "Listings you requested does not exist!");
    res.redirect("/listings");
    // return next(new ExpressError(404, "Listing not found"));
  }

  let originaImageUrl = listing.image.url
  originaImageUrl = originaImageUrl.replace("/upload","/upload/h_300,w_250")
  res.render("listings/edit.ejs", { listing, originaImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename};
      await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  }


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }