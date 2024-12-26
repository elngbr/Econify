import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";

// Import Dashboard Components
import ProfessorDashboard from "./components/dashboard/ProfessorDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import CreateProject from "./components/dashboard/CreateProject";
import EditProject from "./components/dashboard/EditProject";
import ViewTeams from "./components/dashboard/ViewTeams";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Professor Routes */}
        <Route
          path="/professor-dashboard"
          element={
            <PrivateRoute role="professor">
              <ProfessorDashboard />
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
          path="/projects/:id/teams"
          element={
            <PrivateRoute role="professor">
              <ViewTeams userRole="professor" />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id/teams"
          element={
            <PrivateRoute role="student">
              <ViewTeams userRole="student" />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
