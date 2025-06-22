const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const{isLoggedIn, isOwner,validateListings} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
router
 .route("/")
 .get(wrapAsync(listingController.index))
  .post(
     isLoggedIn,
       upload.single('listing[image]'),
       validateListings,
     wrapAsync(listingController.createNewForm ))

// Index Route

router.get("/new",isLoggedIn,listingController.renderNewForm);

// Search route

router.get("/search",listingController.searchByLocation);


router
.route("/:id")
.get(wrapAsync(listingController.showForm))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListings,
    wrapAsync(listingController.updateListings))
.delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.deleteListings));    

// New Route


// Show Route

// Create Route

//Edit Route

router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.editListing));

// update.Route


//Delete Route




module.exports = router;