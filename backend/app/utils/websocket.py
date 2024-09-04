import json
from typing import Dict, List
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect
from loguru import logger

from app.models.chat import MessageResponse


class ConnectionManager:
    def __init__(self):
        # Dictionary to keep track of active WebSocket connections, with user email as the key
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_name: str):
        """
        Handle a new WebSocket connection.

        Args:
            websocket (WebSocket): The WebSocket connection to add.
            user_name (str): The email associated with the WebSocket connection.
        """
        await websocket.accept()  # Accept the WebSocket connection
        self.active_connections[user_name] = websocket  # Store the WebSocket connection
        await self.broadcast_active_users()

    async def disconnect(self, user_name: str):
        """
        Remove a WebSocket connection.

        Args:
            user_name (str): The name associated with the WebSocket connection to remove.
        """
        if user_name in self.active_connections:
            del self.active_connections[user_name]  # Remove the connection and associated details
        await self.broadcast_active_users()

    async def send_personal_message(self, message: str, user_email: str):
        """
        Send a personal message to a specific user.

        Args:
            message (str): The message to send.
            user_email (str): The email of the user to send the message to.
        """
        websocket = self.active_connections.get(user_email)  # Retrieve the WebSocket connection
        connected_users = self.get_connected_users()
        user_names = list(connected_users.keys())[0] if connected_users else None

        response = MessageResponse(username=[user_names], message=message)

        if websocket:
            try:
                await websocket.send_text(response.json())  # Send the message to the WebSocket connection
            except (RuntimeError, WebSocketDisconnect) as e:
                # Handle disconnection
                await self.disconnect(user_email)

    async def broadcast_active_users(self):
        try:
            active_users = list(self.active_connections.keys())
            connections = list(self.active_connections.values())
            for connection in connections:
                await connection.send_json({"activeUsers": active_users})
        except Exception as e:
            logger.error(e)

    def get_connected_users(self) -> Dict[str, WebSocket]:
        return self.active_connections
