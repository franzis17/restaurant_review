import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  // [POST] - Add a Review
  static async apiPostReview(req, res, next) {
    try {
      // Extract details of data from request
      const restaurantId = req.body.restaurant_id;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const review = req.body.text;
      const date = new Date();

      // Call DAO to ADD the data as requested
      const reviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // [PUT] - Update a review
  static async apiUpdateReview(req, res, next) {
    try {
      // Extract details of data from request
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const text = req.body.text;
      const date = new Date();

      // Call DAO to UPDATE the data as requested
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        text,
        date
      );

      // Check for errors
      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      // If the review WAS NOT UPDATED
      if (reviewResponse.modifiedCount == 0) {
        throw new Error(
          "unable to update review - user may not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // DELETE Reviews
  static async apiDeleteReview(req, res, next) {
    try {
      // Extract data from the request
      const reviewId = req.query.id; // "query" instead of a "body"
      const userId = req.body.user_id;
      console.log(reviewId);

      // Call DAO to DELETE the Review
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
