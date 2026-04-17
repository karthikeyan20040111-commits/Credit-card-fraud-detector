import json
import os
import requests
from kafka import KafkaConsumer, KafkaProducer

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
INPUT_TOPIC = "transactions"
OUTPUT_TOPIC = "fraud_alerts"
API_URL = "http://localhost:8000/predict"

def run():
    try:
        consumer = KafkaConsumer(
            INPUT_TOPIC,
            bootstrap_servers=[KAFKA_BROKER],
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            auto_offset_reset='latest'
        )
        producer = KafkaProducer(
            bootstrap_servers=[KAFKA_BROKER],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    except Exception as e:
        print(f"Error connecting to Kafka: {e}")
        return
        
    print(f"Listening on {INPUT_TOPIC}...")
    
    for message in consumer:
        tx = message.value
        try:
            # We call the FastAPI endpoint replacing the direct model evaluation
            response = requests.post(API_URL, json=tx)
            if response.status_code == 200:
                result = response.json()
                risk_score = result.get('risk_score', 0)
                
                print(f"Processed TX. Risk: {risk_score}")
                if risk_score > 0.75:
                    alert = {
                        "transaction": tx,
                        "risk_score": risk_score,
                        "label": result.get("label")
                    }
                    producer.send(OUTPUT_TOPIC, alert)
                    print(f"ALERT Published to {OUTPUT_TOPIC}")
        except Exception as e:
            print(f"Error processing transaction: {e}")

if __name__ == "__main__":
    run()
