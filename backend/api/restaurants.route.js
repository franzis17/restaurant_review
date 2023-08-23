/**
 * Restaurants [ROUTER]:
 * - Sets up the API route endpoints so that a client can make request to the DB
 * - BUT the controller handles the request
 */

import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

// GET
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

// POST - Create a new review
// PUT - Edit a review
// DELETE - Delete a review
router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;
