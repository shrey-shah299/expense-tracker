import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesDropdown from "./CategoriesDropdown.jsx";

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Expense_Form", path: "/expenseform" },
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
    setActiveTab(tab.label);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-black sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <button
              onClick={() => navigate("/")}
              className="focus:outline-none border-none outline-none"
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="pl-2 sm:pl-4 border-l-2 border-black h-12 flex flex-col justify-center items-start">
                  <p
                    className="text-sm sm:text-base lg:text-lg font-bold text-black leading-tight whitespace-nowrap"
                    style={{ fontFamily: "sfUi" }}
                  >
                    The Expense Tracker Website
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Second Row - Navigation */}
        <div className="bg-white border-t border-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex items-center justify-between py-1">
              {/* Hamburger Menu and Search */}
              <div className="flex items-center space-x-1 sm:space-x-4">
                <button
                  className="bg-white hover:text-gray-600 p-2 rounded"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                  style={{ fontFamily: "sfUi" }}
                >
                  <svg
                    className="h-6 w-6 sm:h-8 sm:w-6"
                    fill="black"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="6" width="20" height="3" />
                    <rect x="3" y="11.25" width="20" height="3" />
                    <rect x="3" y="16.5" width="20" height="3" />
                  </svg>
                </button>
              </div>

              {/* Desktop Navigation Links */}
              <ul style={{ fontFamily: "sfUi" }} className="nav-inter hidden lg:flex items-center space-x-1 xl:space-x-4 text-base font-semibold xl:text-lg ">
                {tabs.map((tab) => (
                  <li key={tab.label}>
                    {tab.label === "Categories" ? (
                      <CategoriesDropdown
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    ) : (
                      <span
                        style={{ fontFamily: "sfUi" }}
                        className={`cursor-pointer transition duration-200 px-1 xl:px-2 py-1 whitespace-nowrap ${
                          activeTab === tab.label
                            ? "text-black border-b-2 border-black"
                            : "text-black hover:text-gray-600"
                        } ${
                          tab.label.includes("Series") ||
                          tab.label.includes("Event")
                            ? "flex items-center"
                            : ""
                        }`}
                        onClick={() => handleTabClick(tab)}
                      >
                        {tab.label}
                        {tab.label.includes("Series") && (
                          <svg
                            className="ml-1 w-3 h-3 xl:w-4 xl:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Menu  */}
        {isMobileMenuOpen && (
          <div style={{ fontFamily: "sfUi" }} className="lg:hidden bg-white border-t border-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <ul className="space-y-2 font-semibold">
                {tabs.map((tab) => (
                  <li className="" key={tab.label}>
                    {tab.label === "Categories" ? (
                      <CategoriesDropdown
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isMobile={true}
                        closeMobileMenu={() => setIsMobileMenuOpen(false)}
                      />
                    ) : (
                      <div
                        className={`cursor-pointer transition duration-200 px-4 py-3 rounded ${
                          activeTab === tab.label
                            ? "bg-gray-100 text-black font-semibold"
                            : "text-black hover:bg-gray-50"
                        } flex items-center justify-between`}
                        onClick={() => handleTabClick(tab)}
                      >
                        <span className="text-base sm:text-lg">
                          {tab.label}
                        </span>
                        {tab.label.includes("Series") && (
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;