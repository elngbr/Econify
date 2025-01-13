// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import Home page
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProfessorDashboard from "./components/dashboard/ProfessorDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import DeliverableForm from "./components/dashboard/DeliverableForm";
import ViewDeliverables from "./components/dashboard/ViewDeliverables";
import ProfessorViewDeliverables from "./components/dashboard/ProfessorViewDeliverables";
import CreateProject from "./components/dashboard/CreateProject";
import EditProject from "./components/dashboard/EditProject";
import ViewTeams from "./components/dashboard/ViewTeams";
import Footer from "./pages/Footer";
import Navbar from "./pages/Navbar"; // Import Navbar
import NotFound from "./pages/NotFound"; // Import NotFound page
import SeeDeliverablesToGrade from "./components/dashboard/SeeDeliverablesToGrade";
import ProfessorStatsCharts from "./components/dashboard/ProfessorStatsCharts"; // Import the Statistics component
const App = () => {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar /> {/* Add the Navbar here */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home Page Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/professor-dashboard"
              element={
                <PrivateRoute role="professor">
                  <ProfessorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="deliverables/assigned"
              element={
                <PrivateRoute role="student">
                  <SeeDeliverablesToGrade />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <PrivateRoute role="professor">
                  <CreateProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <PrivateRoute role="professor">
                  <EditProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId/teams"
              element={
                <PrivateRoute role="professor">
                  <ViewTeams userRole="professor" />
                </PrivateRoute>
              }
            />
            <Route
              path="/teams/:teamId/deliverables"
              element={
                <PrivateRoute role="professor">
                  <ProfessorViewDeliverables />
                </PrivateRoute>
              }
            />
            <Route
              path="/deliverables/submit/:projectId"
              element={
                <PrivateRoute role="student">
                  <DeliverableForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/deliverables/team/:teamId"
              element={
                <PrivateRoute role="student">
                  <ViewDeliverables />
                </PrivateRoute>
              }
            />
            <Route
              path="/professor/project-stats"
              element={
                <PrivateRoute role="professor">
                  <ProfessorStatsCharts />
                </PrivateRoute>
              }
            />
            {/* Add the NotFound route for any undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer /> {/* Footer remains at the bottom */}
      </div>
    </Router>
  );
};

export default App;
