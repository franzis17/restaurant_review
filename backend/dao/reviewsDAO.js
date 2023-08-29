import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId; // used when converting a String to mongodb's datatype "Object id"

let reviews; // reference to the reviews collection

export default class ReviewsDAO {
  // Obtain "reviews" collection from the database
  static async injectDB(conn) {
    if (reviews) {
      return;
    }

    // Connect to db to retrieve "reviews" database
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  // ADD the data to the database
  static async addReview(restaurantId, user, review, date) {
    try {
      // Create the object to be stored
      const reviewDoc = {
        restaurant_id: new ObjectId(restaurantId), // Convert string to mongodb's objectID datatype
        name: user.name,
        user_id: user._id,
        text: review,
        date: date,
      };

      // Insert the object to the DB
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  // UPDATE data in the database
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: new ObjectId(reviewId) },
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  // DELETE data from the database
  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
