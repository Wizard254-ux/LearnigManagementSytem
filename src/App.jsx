import { useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import MyUnitsPage from "./Pages/MyUnitsPage";
import Dashboard from "./Pages/DashBoardPage";
import UnitDetail from "./Pages/UnitDetails";
import ExamsBank from "./Pages/ExamsBank";
import LecturerProfile from "./Pages/StaffPage";
import Admin from "./Pages/AdminPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/Units" element={<MyUnitsPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Units/:unitId" element={<UnitDetail />} />
      <Route path="/ExamsBank" element={< ExamsBank/>} />
      <Route path="/Staff" element={< LecturerProfile/>} />
      <Route path="/Admin" element={< Admin/>} />
    </Routes>
  );
}

export default App;
