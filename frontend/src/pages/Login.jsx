import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    room: "",
  });
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (value.trim() === "") {
      return "Username is required";
    }
    return "";
  };

  const validateRoom = (value) => {
    if (value.trim() === "") {
      return "Room is required";
    } else if (isNaN(value) || parseInt(value) <= 0) {
      return "Room must be a positive number";
    }
    return "";
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    const error = validateUsername(value);
    setErrors((prev) => ({ ...prev, username: error }));
  };

  const handleRoomChange = (e) => {
    const value = e.target.value;
    setRoom(value);
    const error = validateRoom(value);
    setErrors((prev) => ({ ...prev, room: error }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const roomError = validateRoom(room);

    setErrors({
      username: usernameError,
      room: roomError,
    });

    if (!usernameError && !roomError) {
      navigate(`/home?username=${username}&room=${room}`);
      localStorage.setItem("username", username);
      console.log("Username:", username);
      console.log("Room:", room);
    } else {
      console.log("Please correct the errors in the form.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-[#242526] shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl text-white font-bold text-center mb-4">
            Login
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username{" "}
              {errors.username && (
                <span className="text-red-500 pl-1 text-xs font-normal">
                  *{errors.username}
                </span>
              )}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUserNameChange}
              className="shadow appearance-none rounded w-full py-2 px-3 bg-black text-white placeholder-gray-500 leading-tight focus:outline-none focus:shadow-outline focus:bg-black focus:text-white"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="room"
            >
              Room{" "}
              {errors.room && (
                <span className="text-red-500 pl-1 text-xs font-normal">
                  *{errors.room}
                </span>
              )}
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={handleRoomChange}
              className="shadow appearance-none rounded w-full py-2 px-3 bg-black text-white placeholder-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter room name"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
