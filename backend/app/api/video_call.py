from fastapi import APIRouter, WebSocket

router = APIRouter(prefix='/video-call', tags=['video-call management'])


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
