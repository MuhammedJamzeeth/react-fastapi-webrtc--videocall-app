import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed sidebar right-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50 rounded-tl-xl`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <div
            className="hover:text-gray-400 items-center gap-4 rounded-lg bg-[#141414] p-2 flex cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
            ref={dropdownRef}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={
                "data:image/jpeg;base64,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"
              }
            />
            Username
          </div>
          <div
            className={`flex flex-col gap-y-1 transition-transform transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <Link
              to="/dashboard"
              className="hover:text-gray-400  rounded-lg bg-[#141414] p-2 flex items-center justify-between"
            >
              Home{" "}
              <span className="ml-2">
                <FaArrowRight />
              </span>
            </Link>

            <Link
              to="/"
              className="hover:text-gray-400  rounded-lg bg-[#141414] p-2 flex items-center justify-between"
            >
              Logout{" "}
              <span className="ml-2">
                <FaArrowRight />
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
