import { Fragment } from "react";
import Home from "../pages/home";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Settings from "../pages/settings";
import ReportLostItem from "../pages/report-lost-item";
import ReportFoundItem from "../pages/report-found-item";
import LostItems from "../pages/lost-items";
import FoundItems from "../pages/found-items";
import LostItemDetail from "../pages/lost-item-detail";
import FoundItemDetail from "../pages/found-item-detail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ItemsProvider } from "./ItemsContext";
import ProtectedRoute from "./ProtectedRoute";
import supabase from "./config/supabaseClient";
import Claims from "../pages/claims";

const App = () => {
  console.log("Supabase Client:", supabase); // Debugging line to check if supabase is initialized correctly
  return (
    <Fragment>
      <AuthProvider>
        <ItemsProvider>
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

                <Route
                  path="/found-items"
                  element={
                    <ProtectedRoute>
                      <FoundItems />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/lost-items"
                  element={
                    <ProtectedRoute>
                      <LostItems />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/claims"
                  element={
                    <ProtectedRoute>
                      <Claims />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/found-item-detail/:itemId"
                  element={
                    <ProtectedRoute>
                      <FoundItemDetail />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/lost-item-detail/:itemId"
                  element={
                    <ProtectedRoute>
                      <LostItemDetail />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ItemsProvider>
      </AuthProvider>
    </Fragment>
  );
};

export default App;
