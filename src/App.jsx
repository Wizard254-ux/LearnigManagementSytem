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
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Auth/ProtectedRoutes";
import AdminCUSpage from "./Pages/AdminCUSpage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
      <Route path="/Home" element={<HomePage />} />
      <Route path="/Units" element={<MyUnitsPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Units/:unitId" element={<UnitDetail />} />
      <Route path="/ExamsBank" element={< ExamsBank/>} />
      <Route path="/Staff" element={< LecturerProfile/>} />
      <Route path="/Entry346512" element={< AdminCUSpage/>} />
      <Route path="/Admin" element={< Admin/>} />
      </Route>
      <Route path="/AdminLogin" element={< AdminLogin/>} />
    </Routes>
  );
}

export default App;
