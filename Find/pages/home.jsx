import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <h1
              className="text-2xl sm:text-3xl font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
              style={{ color: "#c0a062" }}
            >
              LauFind
            </h1>
            <div className="flex gap-2 sm:gap-4">
              <Link
                to="/signin"
                className="px-4 sm:px-6 py-2 border-2 rounded-lg font-semibold transition-all duration-300 ease-in-out"
                style={{
                  color: "#e02d1b",
                  borderColor: "#e02d1b",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(192, 160, 98, 0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="px-4 sm:px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out"
                style={{ backgroundColor: "#17a763" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#17a763";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 12px rgba(192, 160, 98, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#17a763";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight transition-all duration-500 hover:text-opacity-80">
              Lost something on campus?
            </h2>
            <p
              className="text-xl sm:text-2xl font-semibold transition-all duration-500 hover:translate-x-2"
              style={{ color: "#c0a062" }}
            >
              We'll help you find it.
            </p>
            <p className="text-base sm:text-lg text-gray-500 max-w-3xl leading-relaxed transition-all duration-500">
              LauFind connects students and staff to reunite lost items with
              their owners. Report lost items, register found items, and search
              our database to recover what's yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                className="px-6 sm:px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out"
                style={{ backgroundColor: "#c0a062" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#a88a52";
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 12px 20px rgba(192, 160, 98, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#c0a062";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Report Lost Item
              </button>
              <button
                className="px-6 sm:px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-300 ease-in-out"
                style={{
                  color: "#c0a062",
                  borderColor: "#c0a062",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(192, 160, 98, 0.1)";
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 12px 20px rgba(192, 160, 98, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Register Found Item
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
