import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import SignIn from "./components/SignIn";
// import Sup from "./components/Sup";
import MapComponent from "./components/MapComponent";
const App: React.FC = () => {
  const isLoggedIn = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    return username && password;
  };

  React.useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn() ? <Navigate to="/map" /> : <Navigate to="/signin" />
          }
        />

        {/* <Route
          path="/signin"
          element={isLoggedIn() ? <Navigate to="/map" /> : <SignIn />}
        />

        <Route
          path="/signup"
          element={isLoggedIn() ? <Navigate to="/map" /> : <Sup />}
        /> */}

        <Route
          path="/map"
          element={isLoggedIn() ? <MapComponent /> : <Navigate to="/signin" />}
        />

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
