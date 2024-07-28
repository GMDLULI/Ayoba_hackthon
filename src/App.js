//import React from "react";
//import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import FoodOrderBusinessPanel from "./FoodOrderBusinessPanel";
// import Chat from "./Chat";
// import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="App">
      <FoodOrderBusinessPanel />
    </div>
  );
  // return (
  //   <Router>
  //     <div className="App">
  //       <nav>
  //         <ul>
  //           <li>
  //             <Link to="/">Chat</Link>
  //           </li>
  //           <li>
  //             <Link to="/dashboard">Dashboard</Link>
  //           </li>
  //         </ul>
  //       </nav>

  //       <Routes>
  //         <Route path="/" element={<Chat />} />
  //         <Route path="/dashboard" element={<Dashboard />} />
  //       </Routes>
  //     </div>
  //   </Router>
  // );
}

export default App;