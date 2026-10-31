const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req , res) => {
     const { id } = req.params;
     const listing = await Listing.findById(id);
     if (!listing) {
          throw new ExpressError(404, "Listing not found");
     }

     const newReview = new Review(req.body.review);
     newReview.author = req.user._id;

     await newReview.save();
     const updatedListing = await Listing.findByIdAndUpdate(
          id,
          { $push: { reviews: newReview._id } },
          { runValidators: true }
     );
     if (!updatedListing) {
          await Review.findByIdAndDelete(newReview._id);
          throw new ExpressError(404, "Listing not found");
     }

     req.flash("success", "New review added successfully!");
     res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.destroyReview = async (req , res) =>{
       let { id , reviewId } = req.params;

       await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

       req.flash("success", "Review deleted successfully!");
       res.redirect(`/listings/${id}`);
};
