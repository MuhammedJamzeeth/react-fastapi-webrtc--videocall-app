import NavBar from "../components/NavBar";
import { Link, useLocation } from "react-router-dom";
import {
  FaChevronLeft,
  FaMicrophone,
  FaVideo,
  FaMessage,
  FaSquareUpRight,
  FaCircleDot,
  FaFaceSmile,
  FaObjectGroup,
  FaBarsStaggered,
  FaUsers,
  FaCheckDouble,
  FaRightFromBracket,
  FaLink,
} from "react-icons/fa6";
import { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import VideoPlayer from "../components/VideoPlayer";

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const username = queryParams.get("username");
  const receiverName = queryParams.get("receiver");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const { ws, connectToWebSocket, sendMessage, messages, activeUsers } =
    useWebSocket({
      URL: `ws://localhost:8000/video-call/ws/${username}`,
    });

  // Define the functions with useCallback
  const handleOffer = useCallback(
    async (offer) => {
      console.log("offer");

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendMessage({
          type: "answer",
          username: username,
          receiver_name: receiverName,
          answer,
        });

        peerConnection.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
    [peerConnection, sendMessage, receiverName, username]
  );

  const handleAnswer = useCallback(
    async (answer) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    },
    [peerConnection]
  );

  const handleCandidate = useCallback(
    async (candidate) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    },
    [peerConnection]
  );

  useEffect(() => {
    console.log(messages[0]?.message);

    if (messages) {
      messages.forEach(async (message) => {
        const messageObject = JSON.parse(message.message);
        console.log(messageObject);
        switch (messageObject.type) {
          case "offer":
            await handleOffer(messageObject.offer);
            break;
          case "answer":
            await handleAnswer(messageObject.answer);
            break;
          case "candidate":
            await handleCandidate(messageObject.candidate);
            break;
          default:
            break;
        }
      });
    }
  }, [messages]);

  useEffect(() => {
    const initRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
        connectToWebSocket(); // Initialize WebSocket connection
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initRoom();
  }, [connectToWebSocket, peerConnection]);

  const callUser = async () => {
    if (!peerConnection) {
      console.error("PeerConnection is not initialized.");
      return;
    }
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      sendMessage({
        type: "offer",
        username: username,
        receiver_name: receiverName,
        offer,
      });
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  };

  return (
    <div className="text-white">
      <NavBar />
      <div className="container mx-auto pt-8">
        <h1 className="text-4xl font-bold mb-6 mt-40 w-fit">
          <Link to="/dashboard/quests-dashboard">
            <button
              className={`flex gap-4 items-center px-2 py-2 rounded-lg font-semibold text-sm text-white text-[24px]`}
            >
              <FaChevronLeft />
              Exit Meeting
            </button>
          </Link>
        </h1>
        <section className="bg-black shadow-md rounded-lg p-6 mb-8 w-full">
          <nav className="bg-[#242526] p-1 h-12">
            <div className="flex justify-center items-center">
              <div className="relative flex justify-between w-1/5 items-center">
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 inline-flex justify-center group-hover:rounded-lg transition-all ease-in-out duration-300 text-[12px]">
                    Quest Meeting Title
                    <FaUsers />0
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaCheckDouble />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaLink />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaRightFromBracket />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
              </div>
            </div>
          </nav>
        </section>
        <section className="flex items-center justify-center">
          <VideoPlayer stream={localStream} />
          {/* {remoteStream && <VideoPlayer stream={remoteStream} />} */}
          <button onClick={callUser}>Start Call</button>
        </section>
        <section className="bg-black shadow-md rounded-lg p-6 mb-8 w-full">
          <nav className="bg-[#242526] p-1 h-12">
            <div className="flex justify-center items-center">
              <div className="relative flex justify-between w-1/5 items-center">
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaFaceSmile />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaMicrophone />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaVideo />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaObjectGroup />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaMessage />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaSquareUpRight />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaCircleDot />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative group">
                  <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
                    <FaBarsStaggered />
                  </div>
                  <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
                </div>
              </div>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default Home;
