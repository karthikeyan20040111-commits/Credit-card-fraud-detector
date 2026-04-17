# FraudGuard AI

FraudGuard AI is a production-grade, full-stack financial fraud detection and analytics system. It offers real-time streaming risk assessment, historical forensic reporting, federated learning simulations, and deep graph analysis, powered by an ensemble of Machine Learning models and built on a robust, scalable microservices infrastructure.

## Architecture Diagram

```text
    [ Frontend - Next.js (React) ] <----WebSocket/HTTP----> [ Backend - FastAPI ]
        |       |       |       |                                 |
 [User Profile][Graph][Stream][FedLearn]                   (Model Evaluation)
                                                                  |
    [ Frontend UI: Tailwind, Recharts, D3 ]                       |
                                                                  v
             [ Kafka UI/Events ] <------ [ Kafka Stream: transactions & fraud_alerts ]
                                                                  ^
            (Periodic Jobs / Data Ingest) ------------------------+
                                                                  |
                  (PostgreSQL Database with pgvector) <------(Async Session)
                                |
                        (Redis Cache Layer)
```

## Prerequisites
- Node.js >= 18
- Python >= 3.9
- Docker and docker-compose installed locally
- Anthropic API Key (if enabling the full AI Forensic capability)

## Quick Start
1. **Infrastructure**: Start all backend services
   ```bash
   docker-compose up --build -d
   ```
   This will spin up PostgreSQL, Redis, Zookeeper, Kafka, and the FastAPI application.

2. **Frontend Packages**:
   ```bash
   npm install
   ```

3. **Run Frontend**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`

## Dataset Setup & Training Pipeline
To generate initial dummy data and train the initial XGBoost and Isolation Forest models:

1. Exec into the FastAPI container or navigate to the `backend/ml` directory locally.
2. Ensure dependencies are installed (`pip install -r backend/requirements.txt`).
3. Run the train script:
   ```bash
   python backend/ml/train.py
   ```
   This performs SMOTE balancing, 5-fold CV, and generates `xgb_model.pkl` and `iso_model.pkl`.
4. Run the autoencoder script:
   ```bash
   python backend/ml/autoencoder.py
   ```
   This trains the anomaly detection neural network on legitimate requests.

## Module Descriptions

- **User Behavioral Profiling**: Tracks customer behavior compared against the population norm. Allows instant account-level freezing.
- **Graph Analysis**: Displays a D3 forced-directed graph of interactions mapped computationally by PageRank and Louvain methods in NetworkX.
- **Streaming Monitor**: Virtualized WS-fed timeline coupled with an updating geographic map using `react-simple-maps`.
- **Federated Learning**: Simulates local training at parallel banks followed by FedAvg gradient sharing to an Aggregation server for a global model uplift without raw data compromise.

## Tech Stack

| Domain | Tech |
| ------ | -----|
| Frontend Core | Next.js 16, React 19, TypeScript |
| UI & Styling | Tailwind CSS, Lucide React |
| Data Viz | Recharts, D3, react-simple-maps |
| Backend Core | Python FastAPI, Uvicorn |
| Datastore | PostgreSQL (asyncpg, pgvector), Redis |
| Message Broker | Apache Kafka |
| ML framework | Scikit-learn, XGBoost, TensorFlow/Keras |

## API Reference

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/predict` | POST | Submits tx for scoring via ensemble models |
| `/transactions` | GET | Returns latest historical transactions |
| `/retrain` | POST | Triggers programmatic re-training of the ML pipeline |
| `/ws/transactions`| WS | WebSocket connection for streaming scored transactions |
| `/users/{id}/profile`| GET | Retrives a user's forensic and behavioral snapshot |

## Evaluation Metrics
The pipeline evaluation targets:
- Initial Base AUC > 0.90
- SMOTE+Ensemble AUC > 0.97
- Evaluated via `logloss` and `roc_auc_score` with strict 5-fold Stratified CV.

## Future Work
- Integration with an actual LLM for fully automated Chatbot case resolutions.
- Extending federated components with DP-SGD for reinforced cryptographic privacy bounds.
- Geocoding capabilities for full global coordinates mappings.
