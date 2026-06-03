import { createContext, useContext, useState, useEffect } from "react";
import supabase from "./config/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Updated signup with faculty, department, matricNumber
  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    userType,
    faculty,
    department,
    matricNumber,
  }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(error.message);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      // ✅ Only save student fields if user is a student
      faculty: userType === "student" ? faculty : null,
      department: userType === "student" ? department : null,
      matric_number: userType === "student" ? matricNumber : null,
    });

    if (profileError) {
      console.error("Profile insert failed:", profileError.message);
      throw new Error(profileError.message);
    }
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
