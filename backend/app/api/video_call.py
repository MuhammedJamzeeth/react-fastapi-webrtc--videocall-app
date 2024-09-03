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

            await handle_webrtc_signaling(data, manager)
    except WebSocketDisconnect:
        await manager.disconnect(username)
        await manager.broadcast(f"{username} left the chat.")
        logger.info(f"User disconnected {username}")
