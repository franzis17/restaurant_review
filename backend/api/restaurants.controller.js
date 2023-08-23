/**
 * Restaurants [CONTROLLER]:
 * - Basically the Business Logic / Controller(literally)
 * - Handles the API request inputted by users to interact with the DAO
 */

import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  /**
   * Get restaurants based on a filter inputted by a Client.
   * Things that can be provided by the client:
   * - restaurantsPerPage = how many restaurants to display per page
   * - page = how many pages to display
   * - filters:
   *   - cuisine = search any restaurants with the given cuisine
   *   - zipcode = search any restaurants with the given zipcode
   *   - name = search any restaurants with the given restaurant name
   */
  static async apiGetRestaurants(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10) // Convert to int if restaurantsPerPage exists
      : 20; // Otherwise, display default of 20 restaurants per page
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    // Create the filters to be queried to DAO
    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    // Wait to get the restaurantsList & totalNumRestaurants based on the filter provided
    const { restaurantsList, totalNumRestaurants } =
      await RestaurantsDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
      });

    // Return response
    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    res.json(response);
  }
}
