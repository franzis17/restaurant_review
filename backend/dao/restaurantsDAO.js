let restaurants; // Reference to the database

export default class RestaurantsDAO {
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

  static async getRestaurants({
    filters = null, // Filter to sort based on name of restaurants
    page = 0, // What page number you want
    restaurantsPerPage = 20,
  } = {}) {
    let query;

    // Filter out which restaurants to query/retrieve
    if (filters) {
      if ("name" in filters) {
        // search by name of restaurant
        // ** uses Text Index feature of MongoDB ** ($text = whatever field created in MongoDB)
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        // search by cuisine of restaurant
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        // search by zipcode of restaurants
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    // Query the db using the 'filtered' query
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
}
