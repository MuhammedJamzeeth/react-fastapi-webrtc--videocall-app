from fastapi import WebSocket
from typing import List
from loguru import logger

from app.models.chat import Chat
from app.utils.websocket import ConnectionManager

connected_clients: List[WebSocket] = []


async def handle_webrtc_signaling(data: str, websocket: WebSocket, username: str):
    for client in connected_clients:
        if client != websocket:
            await client.send_text(data)


async def connect_client(websocket: WebSocket):
    connected_clients.append(websocket)


async def disconnect_client(websocket: WebSocket):
    connected_clients.remove(websocket)
