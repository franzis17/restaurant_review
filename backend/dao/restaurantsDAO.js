/**
 * Restaurants [DAO - Data Access Object]:
 * - Basically the Database Logic / Model
 * - Communicates directly to the Database to obtain a Collection
 * - Handles DB queries, and communication with DB directly
 * - Used by Controllers to perform DB operations
 */
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let restaurants; // References to the database

export default class RestaurantsDAO {
  // Enables connection to DB
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }

    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  /**
   * Description: Get restaurants using a filter
   * Inputs:
   * - filters = search any restaurants with the given filter (either cuisine, zipcode, or name)
   * - page = which page the client wants to see
   * - restaurantsPerPage = how many restaurants per page the clients wants to see
   */
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;

    // Filter out which restaurants to query/retrieve
    if (filters) {
      if ("name" in filters) {
        // search by name of restaurant
        // uses `Text Index` feature of MongoDB ($text = whatever field created in MongoDB)
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        // search by cuisine of restaurant
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        // search by zipcode of restaurant
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    // Once filtered, Query the db using the 'filtered' query
    let cursor;

    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    // Limit amount of restaurants to show per page
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents: ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  /**
   * Search a restaurant given an inputted id AND get all reviews of that restaurant
   */
  static async getRestaurantById(id) {
    try {
      const pipeline = [
        // 1st stage: Find a restaurant given the id
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        // 2nd stage: GET ALL reviews of the restaurant that was found
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              // Find all the reviews that MATCH the restaurant_id
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              // Sort by date
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      // Aggregate the pipeline / Collect everything together
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantById: ${e}`);
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
