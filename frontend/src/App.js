import React from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review.js";
import Login from "./components/login.js";
import RestaurantsList from "./components/restaurants-list.js";
import Restaurant from "./components/restaurant.js";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor: 'pointer'}}> 
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          {/* Route for restaurants list */}
          <Route exact path="/" component={RestaurantsList} />
          {/* Route for add review for a specific restaurant */}
          <Route
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />
          {/* Route for Finding a specific restaurant */}
          <Route
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />
          {/* Route for user login */}
          <Route
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
