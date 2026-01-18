import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CategoriesDropdown = ({
  activeTab,
  setActiveTab,
  isMobile = false,
  closeMobileMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
     { label: "Dashboard", path: "/" },
    { label: "Expense_Form", path: "/expenseform" },
  ];

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleCategoryClick = (category) => {
    navigate(category.path);
    setActiveTab(category.name);
    setIsOpen(false);
    if (closeMobileMenu) closeMobileMenu();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Mobile View
  if (isMobile) {
    return (
      <div className="w-full -ml-1" style={{ fontFamily: "sfUi" }}>
        <button
          onClick={toggleDropdown}
          className="w-full cursor-pointer transition duration-200 px-4 py-3 rounded flex items-center justify-between text-black hover:bg-gray-50"
        >
          <span className="text-base font-semibold sm:text-lg">Categories</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="pl-4 py-2 space-y-1" style={{ fontFamily: "sfUi" }}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div
      className="relative -ml-2"
      ref={dropdownRef}
      style={{ fontFamily: "sfUi" }}
    >
      <button
        onClick={toggleDropdown}
        className={`cursor-pointer transition duration-200 px-1 xl:px-2 py-1 whitespace-nowrap flex items-center  ${
          activeTab === "Categories"
            ? "text-black border-b-2  border-black"
            : "text-black hover:text-gray-600 "
        }`}
      >
        <span className="font-semibold">Categories</span>
        <svg
          className={`ml-1 w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left px-4 py-3 text-black hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;

