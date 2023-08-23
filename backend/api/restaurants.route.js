import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";

const router = express.Router();

// Demo route
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

export default router;
