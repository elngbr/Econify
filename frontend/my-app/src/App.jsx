import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProfessorDashboard from "./components/dashboard/ProfessorDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import DeliverableForm from "./components/dashboard/DeliverableForm";
import ViewDeliverables from "./components/dashboard/ViewDeliverables";
import ProfessorViewDeliverables from "./components/dashboard/ProfessorViewDeliverables"; // Import ProfessorViewDeliverables
import CreateProject from "./components/dashboard/CreateProject"; // Create Project Component
import EditProject from "./components/dashboard/EditProject"; // Edit Project Component
import ViewTeams from "./components/dashboard/ViewTeams"; // View Teams Component

const App = () => {
  return (
    <Router>
      <Routes>
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
