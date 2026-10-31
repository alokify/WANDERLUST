const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema , reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });


const listingController = require("../controllers/listings.js");

router.route("/listings")
.get( wrapAsync (listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

//NEW ROUTE
router.get("/listings/new",
     isLoggedIn,
     listingController.renderNewform,
    );



router.route("/listings/:id")
.get( wrapAsync (listingController.showListing))
.put(
    isLoggedIn, 
    isOwner,
     upload.single("listing[image]"),
    validateListing, wrapAsync (listingController.updateListing)
)
.delete(
    isLoggedIn, 
    isOwner,
    wrapAsync (listingController.destroyListing)
);



// INDEX ROUTE
// router.get("/listings", wrapAsync (listingController.index));




//SHOW ROUTE
// router.get("/listings/:id", wrapAsync (listingController.showListing));

//CREATE ROUTE
// router.post("/listings",
//          isLoggedIn, 
//          validateListing, wrapAsync (listingController.createListing));
 
//EDIT ROUTE
router.get("/listings/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.renderEditform));

//UPDATE ROUTEs
// router.put("/listings/:id",
//     isLoggedIn, 
//     isOwner,
//     validateListing, wrapAsync (listingController.updateListing));

//DELETE ROUTE
// router.delete("/listings/:id",
//     isLoggedIn, 
//     isOwner,
//     wrapAsync (listingController.destroyListing));

module.exports = router;


