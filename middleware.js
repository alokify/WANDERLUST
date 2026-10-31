const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js")

module.exports.isLoggedIn = ( req , res , next ) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async ( req , res , next ) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if( !listings.owner.equals(res.locals.currUser._id)) {
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req , res , next) => {
      const { error } = listingSchema.validate(req.body);
      console.log(error);
         if (error) {
            let errorMessage = error.details.map(el => el.message).join(",");
             throw new ExpressError(400, errorMessage);
         } else {
         next();
     }
};

module.exports.validateReview = (req , res , next) => {
      const { error } = reviewSchema.validate(req.body);
      console.log(error);
         if (error) {
            let errorMessage = error.details.map(el => el.message).join(",");
             throw new ExpressError(400, errorMessage);
         } else {
         next();
     }
};

module.exports.isReviewAuthor = async ( req , res, next ) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        throw new ExpressError(404, "Review not found");
    }
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};