import os

from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(mongo_url)
db = client.get_database('fastapi_chatapp')
users_collection = db.get_collection("user")


async def startup():
    try:
        await db.command("ping")
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e


async def shutdown():
    if client:
        client.close()
        logger.info("MongoDB connection closed.")
