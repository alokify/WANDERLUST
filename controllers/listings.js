const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req , res ) => {
    let allListings = await Listing.find({});
    res.render("index.ejs", {allListings}); 
};

module.exports.renderNewform = (req , res ) => {
     res.render("new.ejs");
};

module.exports.showListing = async (req , res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({ path:"reviews", 
      populate: { 
        path: "author",
      },
    })
     .populate("owner");
     if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
     }
     console.log(listing);
     res.render("show.ejs", {listing});
};

module.exports.createListing = async (req , res, next) => {
       let response = await geocodingClient.forwardGeocode({
       query: req.body.listing.location,
       limit: 1,
     })
      .send()

         const newListing = new Listing(req.body.listing);
         newListing.owner = req.user._id;
         if (req.file) {
             newListing.image = {
                 url: req.file.path,
                 filename: req.file.filename,
             };
         }

         newListing.geometry = response.body.features[0].geometry;

         let savedListing = await newListing.save();
         console.log(savedListing);
         req.flash("success", "New listing created successfully!");
         res.redirect("/listings");
};


module.exports.renderEditform = async (req , res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
     }

     let orginalImageUrl = listing.image.url;
     orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/w_300,h_200,c_fill");
    res.render("edit.ejs", {listing, orginalImageUrl});
};

module.exports.updateListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req ,res) => {
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

