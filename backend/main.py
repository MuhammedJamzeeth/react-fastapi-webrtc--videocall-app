import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os

from app.db.database import startup_db, shutdown_db

load_dotenv()

HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))

app = FastAPI(
    title="Chat App"
)


@app.on_event("startup")
async def startup_event():
    await startup_db()


@app.on_event("shutdown")
async def on_shutdown():
    await shutdown_db()


if __name__ == "__main__":
    uvicorn.run(
        app="app.main:app",
        host=HOST,
        port=PORT,
        reload=True
    )
