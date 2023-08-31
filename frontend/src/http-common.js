/**
 * A helper file
 * - Automatically do http request such as GET + POST + PUT + DELETE, to make it easy
 */

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/v1/restaurants",
  headers: {
    "Content-type": "application/json"
  }
});
