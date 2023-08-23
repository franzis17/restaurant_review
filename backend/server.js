/**
 * Contains the code for: express app, initial API routes,
 */

import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

// Create express *app* to be used for
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1/restaurants", restaurants);
// routes that does not exist returns an error
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
