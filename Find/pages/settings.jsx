import React, { useState, useEffect } from "react";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import { User, Mail, ShieldCheck } from "lucide-react";
import supabase from "../src/config/supabaseClient";

const Settings = () => {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id) // match logged in user
        .single(); // returns one object, not an array

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setProfile(data);
      }

      setLoadingProfile(false);
    }

    fetchProfile();
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3 pt-20 md:pt-0">
          <div className="max-w-6xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold">
                Settings
              </p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                Account details
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                Review and manage the information you provided during signup.
              </p>
            </div>

            {loadingProfile ? (
              <p className="text-gray-500">Loading profile...</p>
            ) : (
              <section className="rounded-4xl bg-white p-6 shadow-lg border border-gray-200">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <User className="h-5 w-5 text-indigo-500" />
                        <span>Full Name</span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-gray-900">
                        {/* ✅ Now reading from profiles table */}
                        {profile?.first_name || "-"} {profile?.last_name || "-"}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <Mail className="h-5 w-5 text-teal-500" />
                        <span>Email Address</span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-gray-900">
                        {/* ✅ Email comes from Supabase auth user */}
                        {currentUser?.email || "-"}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                        <span>User Role</span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-gray-900 capitalize">
                        {/* ✅ user_type from profiles table */}
                        {profile?.user_type || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Show student fields only if user is a student */}
                    {profile?.user_type === "student" && (
                      <>
                        <div className="rounded-3xl bg-slate-50 p-5">
                          <div className="text-sm font-semibold text-gray-700">
                            Faculty
                          </div>
                          <p className="mt-3 text-lg font-semibold text-gray-900">
                            {profile?.faculty || "-"}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-5">
                          <div className="text-sm font-semibold text-gray-700">
                            Matric Number
                          </div>
                          <p className="mt-3 text-lg font-semibold text-gray-900">
                            {profile?.matric_number || "-"}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="text-sm font-semibold text-gray-700">
                        Department
                      </div>
                      <p className="mt-3 text-lg font-semibold text-gray-900">
                        {profile?.department || "-"}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="text-sm font-semibold text-gray-700">
                        Account Status
                      </div>
                      <p className="mt-3 text-lg font-semibold text-green-600">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
