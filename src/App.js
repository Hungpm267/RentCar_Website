import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/Routes";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>{publicRoutes.map((route, index) => {
          const Page = route.page;
          return <Route
            key={index}
            path={route.path}
            element={<Page />}>
          </Route>
        })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
