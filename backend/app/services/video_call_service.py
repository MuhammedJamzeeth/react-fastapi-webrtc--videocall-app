import json

from fastapi import WebSocket
from typing import List
from loguru import logger

from app.utils.websocket import ConnectionManager

connected_clients: List[WebSocket] = []


async def handle_webrtc_signaling(data: str, manager: ConnectionManager):
    logger.info(f"New Connection: {data}")
    try:
        parsed_data = json.loads(data)
        logger.info(parsed_data["message"])
        if "receiver_name" in parsed_data and "message" in parsed_data and parsed_data["type"] == "personal":
            await manager.send_personal_message(data, parsed_data["receiver_name"])
    except Exception as e:
        logger.error(f"Failed {e}")
