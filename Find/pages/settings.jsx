import React, { useState } from "react";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import { User, Mail, ShieldCheck } from "lucide-react";

const Settings = () => {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3">
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

            <section className="rounded-4xl bg-white p-6 shadow-lg border border-gray-200">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <User className="h-5 w-5 text-indigo-500" />
                      <span>Full Name</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-900">
                      {currentUser?.firstName || "-"}{" "}
                      {currentUser?.lastName || ""}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <Mail className="h-5 w-5 text-teal-500" />
                      <span>Email Address</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-900">
                      {currentUser?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <ShieldCheck className="h-5 w-5 text-amber-500" />
                      <span>User Role</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-900 capitalize">
                      {currentUser?.userType || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-gray-700">
                      Account Status
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-900">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
