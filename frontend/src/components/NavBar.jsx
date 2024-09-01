import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Avatar from "react-avatar";

export default function NavBar() {
  const user = localStorage.getItem("username");

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
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
            <Avatar
              name={user}
              size="40"
              round={true}
              alt={`${user}'s avatar`}
              textSizeRatio={2}
              className="w-8 h-8 rounded-full"
            />
            {user}
          </div>
          <div
            className={`flex flex-col gap-y-1 transition-transform transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <Link
              to="/home"
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
              onClick={handleLogout}
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
