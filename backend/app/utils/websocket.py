from typing import Dict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # Dictionary to keep track of active WebSocket connections, with user email as the key
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_email: str):
        """
        Handle a new WebSocket connection.

        Args:
            websocket (WebSocket): The WebSocket connection to add.
            user_email (str): The email associated with the WebSocket connection.
        """
        await websocket.accept()  # Accept the WebSocket connection
        self.active_connections[user_email] = websocket  # Store the WebSocket connection

    def disconnect(self, user_email: str):
        """
        Remove a WebSocket connection.

        Args:
            user_email (str): The email associated with the WebSocket connection to remove.
        """
        self.active_connections.pop(user_email, None)  # Remove the connection from the dictionary

    async def send_personal_message(self, message: str, user_email: str):
        """
        Send a personal message to a specific user.

        Args:
            message (str): The message to send.
            user_email (str): The email of the user to send the message to.
        """
        websocket = self.active_connections.get(user_email)  # Retrieve the WebSocket connection
        if websocket:
            await websocket.send_text(message)  # Send the message to the WebSocket connection

    async def broadcast(self, message: str):
        """
        Send a message to all connected users.

        Args:
            message (str): The message to broadcast to all users.
        """
        for connection in self.active_connections.values():  # Iterate over all active connections
            await connection.send_text(message)  # Send the message to each WebSocket connection

    def get_connected_users(self) -> Dict[str, WebSocket]:
        return self.active_connections
