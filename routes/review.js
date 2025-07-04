const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing");
const{
    validateReview,
    isLoggedIn,
    reviewAuthor
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



//Reviews
//Post Route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//Delete Review route

router.delete("/:reviewId",
    isLoggedIn,
    reviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;

