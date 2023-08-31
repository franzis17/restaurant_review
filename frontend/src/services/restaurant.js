/**
 * Contains functions that does API calls to retrieve information from the backend server
 */
import http from "../http-common";

class RestaurantDataService {
  
  /**
   * Get all restaurants
   * Parameters:
   * - page (default=0): determines which page the database should return
   */
  getAll(page = 0) {
    // Note: the string below is a URL added in the end of `baseURL` inside "http-common.js"
    return http.get(`?page=${page}`);
  }
  
  /**
   * GET a specific restaurant using its id
   * Parameters:
   * - id: the restaurant's id in the database
   */
  get(id) {
    return http.get(`/id/${id}`);
  }
  
  /**
   * Finds a specific restaurant using a *search term*
   * Parameters:
   * - by (default="name"): could be by "zipcode", "name", or "cuisine"
   * - query: the *search term* to find
   * - page (default=0): what page number do you want
   * Example:
   * - Goal: Search a restaurant with a zipcode 6146, which is near my house so I can eat
   * - Code: by="zipcode", 6146, 0
   */
  find(query, by = "name", page = 0) {
    return http.get(`/?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    return http.post("/review-new", data);
  }

  updateReview(data) {
    return http.put("/review-edit", data);
  }

  deleteReview(id, userId) {
    return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});
  }

  getCuisines(id) {
    return http.get(`/cuisines`);
  }
  
}

const restaurantDataService = new RestaurantDataService();
export default restaurantDataService;
