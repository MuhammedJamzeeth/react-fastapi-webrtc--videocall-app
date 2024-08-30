import os

from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL")

client = None


async def startup_db():
    global client
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client['fastapi_chatapp']

        await db.command("ping")
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect MongoDB: {e}")
        client = None
        raise e


async def shutdown_db():
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")
