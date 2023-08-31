import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams } from "react-router-dom";

const Restaurant = (user) => {
  
  // Initial state of the restaurant
  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };
  const [restaurant, setRestaurant] = useState(initialRestaurantState);
  
  let restaurantId = useParams().id;

  // Upon the first render, useEffect() gets called
  useEffect(() => {
    getRestaurant(restaurantId);
  }, [restaurantId]);  // useEffect() will only be called only if the [id] is updated
  
  // Get the restaurant using its id
  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then(response => {
        setRestaurant(response.data);
        console.log("[/components/restaurant.js] Get restaurant: " + response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // DELETE Review - Can only delete review if it is the right user
  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, user.id)
      .then(response => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          <Link to={"/restaurants/" + restaurantId + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
             restaurant.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {user && user.id === review.user_id &&
                          <div className="row">
                            <button onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</button>
                            <Link to={{
                              pathname: "/restaurants/" + restaurantId + "/review",
                              state: {
                                currentReview: review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
}

export default Restaurant;
