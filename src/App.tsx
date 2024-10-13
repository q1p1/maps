import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MapComponent from "./components/MapComponent";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapComponent />} />

        <Route path="/map" element={<MapComponent />} />

        <Route path="*" element={<Navigate to="/map" />} />
      </Routes>
    </Router>
  );
};

export default App;
