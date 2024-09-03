from fastapi import WebSocket
from typing import List
from loguru import logger
from starlette.websockets import WebSocketDisconnect

from app.models.chat import Chat

from app.utils.websocket import ConnectionManager

connected_clients: List[WebSocket] = []


async def handle_webrtc_signaling(data: str, manager: ConnectionManager):
    receiver_name = None
    logger.info(f"New Connection: {data}")

    try:
        # Parse the incoming data
        data_parse = Chat.parse_raw(data)
        chat_dict = data_parse.dict()
        logger.info(f"New Connection: {chat_dict}")

        # Extract relevant information from the parsed data
        receiver_name = chat_dict.get('receiver_name')
        user_name = chat_dict.get('user_name')

        message_type = chat_dict.get("type")

        if not receiver_name:
            raise ValueError("Receiver name is missing in the signaling data")

        # Handle different message types
        if message_type == "offer":
            logger.info("Processing offer")
            await manager.send_personal_message(data, receiver_name)
            logger.info("Offer sent to receiver")
        elif message_type == "answer":
            logger.info("Processing answer")
            await manager.send_personal_message(data, receiver_name)
            logger.info("Answer sent to receiver")
        elif message_type == "disconnect":
            await manager.disconnect(user_name)
        elif message_type == "personal":
            await manager.send_personal_message(data, receiver_name)
            logger.info(data)
            logger.info("Personal message sent to receiver")
        else:
            logger.warning(f"Unknown message type: {message_type}")

    except ValueError as ve:
        logger.error(f"Value error occurred: {ve}")
        # Handle specific value error, such as missing data
        await manager.send_personal_message(f"Error: {ve}", receiver_name)
    except WebSocketDisconnect:
        manager.disconnect(receiver_name)
        logger.error(f"WebSocket disconnected for receiver: {receiver_name}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        # Send a generic error message to the receiver
        if receiver_name:
            await manager.send_personal_message("An error occurred during signaling.", receiver_name)
    finally:
        # Always log when the function completes, regardless of success or error
        if receiver_name:
            logger.info(f"Completed handling signaling for receiver: {receiver_name}")


async def connect_client(websocket: WebSocket):
    connected_clients.append(websocket)


async def disconnect_client(websocket: WebSocket):
    connected_clients.remove(websocket)
