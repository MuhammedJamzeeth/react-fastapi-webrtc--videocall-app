import { useCallback, useEffect, useRef, useState } from "react";

const useWebSocket = ({ URL, reconnectedInterval = 5000, maxRetries = 10 }) => {
  const [ws, setWs] = useState(null);
  const retryCount = useRef(0);
  const [messages, setMessages] = useState([]);

  const connectToWebSocket = useCallback(() => {
    const socket = new WebSocket(URL);
    setWs(socket);

    socket.onopen = () => {
      console.log(`Connected to the WebSocket server`);
      retryCount.current = 0;
    };

    socket.onclose = (event) => {
      console.log(`Disconnected from the WebSocket server: ${event.reason}`);
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        setTimeout(() => {
          connectToWebSocket();
        }, reconnectedInterval);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
      socket.close();
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    return socket;
  }, [URL, reconnectedInterval, maxRetries]);

  useEffect(() => {
    const socket = connectToWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectToWebSocket]);

  const connectRoom = useCallback(
    (room_id = 100) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.log(
          `Cannot connect to room. WebSocket is not open: ${room_id}`
        );
        return;
      }

      console.log(`Connected to the WebSocket server: ${room_id}`);
    },
    [ws]
  );

  const sendMessage = useCallback(
    (message) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.log("WebSocket is not connected");
        return;
      }
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Failed to send message via WebSocket:", error);
      }
    },
    [ws]
  );

  return { ws, connectToWebSocket, connectRoom, sendMessage, messages };
};

export default useWebSocket;
