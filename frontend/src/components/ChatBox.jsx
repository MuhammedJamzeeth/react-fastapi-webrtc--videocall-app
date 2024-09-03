import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { extractTime } from "../utils/timeUtil";

const ChatBox = ({
  name = "",
  activeUsers = [],
  handleMessage,
  messages = [],
}) => {
  const user = localStorage.getItem("username");

  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [chat, setChat] = useState([]);

  useEffect(() => {
    setChat(messages);
    console.log(messages);
  }, [] );

  useEffect(() => {
    setIsConnected(activeUsers.includes(name));
  }, [name, activeUsers]);

  const handleSubmit = () => {
    handleMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-full">
      <div className="flex-1 flex flex-col border border-gray-800 ">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center">
            <Avatar
              name={name}
              size="40"
              round={true}
              alt={`${name}'s avatar`}
              textSizeRatio={2}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-semibold text-white">{name}</p>
              <p className="text-sm text-gray-500">
                {isConnected ? "connected" : "not connected"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar">
          {messages.map((msg, index) => (
            <div key={index}>
              <div
                className={`flex items-start ${
                  msg.username === user ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{
                    backgroundColor:
                      msg.sender_email === user ? (
                        <Avatar
                          name={name}
                          size="40"
                          round={true}
                          alt={`${name}'s avatar`}
                          textSizeRatio={2}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <Avatar
                          name={name}
                          size="40"
                          round={true}
                          alt={`${name}'s avatar`}
                          textSizeRatio={2}
                          className="w-8 h-8 rounded-full"
                        />
                      ),
                  }}
                ></div>
                <div className="ml-2">
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-black">{msg?.content}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {extractTime(msg?.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t w-full ">
        <div className="px-6 py-4 flex-1">
          <div className="flex rounded-lg overflow-hidden">
            {/* <span className="text-3xl text-grey border-r-4 border-gray-800 bg-gray-800 p-2">
              <svg
                className="h-6 w-6 block bg-black hover:bg-blue-600 cursor-pointer rounded-xl"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"
                  fill="#FFFFFF"
                />
              </svg>
            </span> */}
            <input
              type="text"
              name="newMessage"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className=" flex-1 p-2 w-full px-4 bg-gray-800 border border-gray-700 rounded"
              placeholder="Type your message here"
            />
            <button
              className="ml-2 p-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
