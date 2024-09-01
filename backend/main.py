import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os

from app.db.database import shutdown, startup
from app.api.auth import router as auth_router
from app.api.video_call import router as call_router

load_dotenv()

HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))

app = FastAPI(
    title="Chat App"
)


@app.on_event("startup")
async def startup_event():
    await startup()


app.include_router(auth_router)
app.include_router(call_router)


@app.on_event("shutdown")
async def on_shutdown():
    await shutdown()


if __name__ == "__main__":
    uvicorn.run(
        app="app.main:app",
        host=HOST,
        port=PORT,
        reload=True
    )
