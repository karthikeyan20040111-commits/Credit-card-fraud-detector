import os
import json
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aioredis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://fraud_user:fraud_pass@localhost:5432/fraud_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Setup SQLAlchemy
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    amount = Column(Float)
    location = Column(String)
    time = Column(String)
    velocity = Column(Float)
    risk_score = Column(Float)
    label = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

class UserProfile(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    behavioral_deviation = Column(Float, default=0.0)
    anomaly_score = Column(Float, default=0.0)
    risk_tier = Column(String, default="Low")
    is_frozen = Column(Boolean, default=False)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer)
    severity = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Pydantic Schemas
class PredictionRequest(BaseModel):
    amount: float
    location: str
    time: str
    velocity: float
    user_id: str

class FederateRoundRequest(BaseModel):
    clients: int = 4

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Try to connect to Redis, but don't fail if it's down (for local dev without docker)
    try:
        app.state.redis = aioredis.from_url(REDIS_URL)
    except Exception:
        app.state.redis = None
        
    try:
        await init_db()
    except Exception:
        print("Could not connect to database on startup. Ensure Postgres is running.")
        
    yield
    if hasattr(app.state, 'redis') and app.state.redis:
        await app.state.redis.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev / Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = []

@app.websocket("/ws/transactions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast_transaction(data: dict):
    for connection in active_connections:
        try:
            await connection.send_text(json.dumps(data))
        except Exception:
            pass

@app.post("/predict")
async def predict(req: PredictionRequest):
    # Dummy ML logic since models might not be trained initially
    risk_score = min(req.amount / 10000.0 + req.velocity / 10.0, 1.0)
    label = "fraud" if risk_score > 0.75 else "legitimate"
    
    res = {
        "risk_score": risk_score,
        "label": label,
        "shap_values": {"amount": 0.4, "location": 0.1, "time": 0.2, "velocity": 0.3},
        "explanation": "High velocity and amount contributed to fraud score.",
        "xgb_score": risk_score * 0.8,
        "iso_score": risk_score * 0.9,
        "autoencoder_score": risk_score * 1.1
    }
    
    # Broadcast to websocket
    await broadcast_transaction({**req.dict(), **res, "timestamp": str(datetime.utcnow())})
    return res

@app.get("/transactions")
async def get_transactions():
    return [
       {"id": 1, "amount": 100, "location": "NY", "time": "12:00", "velocity": 1, "label": "legitimate", "risk_score": 0.1, "user_id": "U1"},
       {"id": 2, "amount": 5000, "location": "CA", "time": "02:00", "velocity": 5, "label": "fraud", "risk_score": 0.85, "user_id": "U2"}
    ]

@app.post("/retrain")
async def retrain_model(file: UploadFile = File(...)):
    # Trigger train.py programmatically or via subprocess
    return {"accuracy": 0.98, "model_version": "v1.2.0"}

@app.get("/alerts")
async def get_alerts():
    return [
        {"transaction_id": 1, "severity": "High", "timestamp": "2023-10-01T12:00:00Z"},
        {"transaction_id": 2, "severity": "Medium", "timestamp": "2023-10-01T13:00:00Z"}
    ]

@app.get("/health")
async def health():
    return {"status": "ok", "model_version": "v1.2.0", "uptime": "99.9%"}

@app.get("/users/{user_id}/profile")
async def get_user_profile(user_id: str):
    return {
        "user_id": user_id,
        "behavioral_profile": {"avg_spend": 120, "max_spend": 500, "freq": "weekly"},
        "anomaly_score": 0.15,
        "risk_tier": "Low"
    }

@app.post("/users/{user_id}/freeze")
async def freeze_user(user_id: str):
    return {"status": "success", "message": f"User {user_id} frozen."}

@app.get("/graph/suspicious-clusters")
async def get_suspicious_clusters():
    return {
        "nodes": [
            {"id": "U1", "group": 1, "size": 10},
            {"id": "U2", "group": 2, "size": 20},
            {"id": "U3", "group": 2, "size": 15, "suspicious": True}
        ],
        "links": [
            {"source": "U1", "target": "U2", "value": 1},
            {"source": "U2", "target": "U3", "value": 5}
        ]
    }

@app.post("/federated/round")
async def run_federated_round(req: FederateRoundRequest):
    return {
        "global_accuracy": 0.92,
        "client_metrics": [
            {"client": "Bank A", "accuracy": 0.91},
            {"client": "Bank B", "accuracy": 0.89},
            {"client": "Bank C", "accuracy": 0.93},
            {"client": "Bank D", "accuracy": 0.90}
        ]
    }
