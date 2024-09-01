from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from loguru import logger

from app.models.chat import Chat
from app.services.video_call_service import handle_webrtc_signaling
from app.utils.websocket import ConnectionManager

router = APIRouter(prefix='/video-call', tags=['video-call management'])

manager = ConnectionManager()


@router.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            # logger.info(manager.get_connected_users())

            data_parse = Chat.parse_raw(data)
            chat_dict = data_parse.dict()
            logger.info(f"New Connection {chat_dict}")

            # Retrieve receiver's WebSocket connection
            receiver_name = chat_dict.get('receiver_name')
            logger.info(f"Looking for receiver: {receiver_name}")

            await manager.send_personal_message(data, receiver_name)
            await handle_webrtc_signaling(data, websocket, username)
    except WebSocketDisconnect:
        manager.disconnect(username)
        logger.info(f"Client disconnected from room {username}")
