let ws = null;
const webSocketService = () => {
  ws = new WebSocket("ws://localhost:8000");
  
  ws.onopen = () => {
    console.log("Connected to the WebSocket server");
  };
  ws.onclose = () => {
    console.log("Disconnected from the WebSocket server");
  };
  return {};
};

export default webSocketService;
