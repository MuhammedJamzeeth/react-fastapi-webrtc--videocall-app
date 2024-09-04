import {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";


const useWebSocket = ({URL, reconnectedInterval = 5000, maxRetries = 10}) => {
    const [ws, setWs] = useState(null);
    const retryCount = useRef(0);
    const [activeUsers, setActiveUsers] = useState()
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages.messages);


    const handelData = useCallback((data) => {
        if (data?.activeUsers) {
            console.log("Active users:", data.activeUsers);
            setActiveUsers(data.activeUsers)
        }
        if (data?.message) {
            const parsedMessages = JSON.parse(data.message);
            dispatch({type: "ADD_MESSAGE", payload: parsedMessages})
        }
    }, [dispatch])

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
            const receivedData = JSON.parse(event.data);
            console.log("Received message:", receivedData);
            handelData(receivedData);
        };
        return socket;
    }, [URL, reconnectedInterval, maxRetries, handelData]);

    useEffect(() => {
        const socket = connectToWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connectToWebSocket]);


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

    return {
        ws,
        connectToWebSocket,
        sendMessage,
        activeUsers,
        messages
    };
};

export default useWebSocket;
