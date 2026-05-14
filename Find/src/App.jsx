import { Fragment } from "react";
import Home from "../pages/home";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Settings from "../pages/settings";
import ReportLostItem from "../pages/report-lost-item";
import ReportFoundItem from "../pages/report-found-item";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Fragment>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-lost-item"
                element={
                  <ProtectedRoute>
                    <ReportLostItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-found-item"
                element={
                  <ProtectedRoute>
                    <ReportFoundItem />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Fragment>
  );
};

export default App;
