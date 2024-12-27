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
          path="/deliverables/submit/:projectId"
          element={
            <PrivateRoute role="student">
              <DeliverableForm />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
