"""
Celery application instance.
"""
from celery import Celery  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery = Celery(
    "call_analytics",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["tasks.pipeline"],
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
)

if __name__ == "__main__":
    celery.start()
