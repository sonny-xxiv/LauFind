import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const signup = (userData) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((user) => user.email === userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Add new user
    const newUser = {
      id: Date.now(),
      ...userData,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Log in the user
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
