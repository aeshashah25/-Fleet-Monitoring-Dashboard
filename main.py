from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import time
import asyncio
from typing import List
from uuid import uuid4
import uvicorn
import os

app = FastAPI()

# Allow CORS for frontend requests (from localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Simulated Robot Data
robots = [
    {
        "id": str(uuid4()), 
        "status": random.choice([True, False]),
        "battery": random.randint(1, 100),
        "cpu": random.randint(10, 90),
        "ram": random.randint(500, 4000),
        "location": {
            "lat": round(random.uniform(-90, 90), 6),
            "lng": round(random.uniform(-180, 180), 6)
        },
        "last_updated": time.time()
    } for _ in range(10)
]

# Update robot data periodically (mock telemetry data)
async def update_robot_data():
    global robots
    while True:
        for robot in robots:
            robot['status'] = random.choice([True, False])
            robot['battery'] = max(0, robot['battery'] - random.randint(0, 10))
            robot['cpu'] = random.randint(10, 90)
            robot['ram'] = random.randint(500, 4000)
            robot['location'] = {
                "lat": round(robot['location']['lat'] + random.uniform(-0.05, 0.05), 6),
                "lng": round(robot['location']['lng'] + random.uniform(-0.05, 0.05), 6)
            }
            robot['last_updated'] = time.time()
        await asyncio.sleep(5)

@app.get("/fake_robot_data")
async def get_robot_data():
    return robots

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.send_json(robots)
        await asyncio.sleep(5)  # Sending data every 5 seconds


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Get the dynamic port if it's available
    uvicorn.run("main:app", host="0.0.0.0", port=port)

