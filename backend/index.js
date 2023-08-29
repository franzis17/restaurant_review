// Connect to the database and start the server
import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

// Connect to db
MongoClient.connect(process.env.RESTREVIEWS_DB_URI)
  .catch((err) => {
    console.error(
      `Error: Cannot connect to the database.\n\nError stack:\n${err.stack}`
    );
    process.exit(1);
  })
  .then(async (client) => {
    // Get a reference to the MongoDB collection "restaurants"
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);

    // Start the server
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
