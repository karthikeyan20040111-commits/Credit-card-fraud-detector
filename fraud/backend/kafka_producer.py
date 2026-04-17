import time
import json
import random
import os
from kafka import KafkaProducer
from datetime import datetime

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TOPIC = "transactions"

def get_producer():
    try:
        return KafkaProducer(
            bootstrap_servers=[KAFKA_BROKER],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    except Exception as e:
        print(f"Error connecting to Kafka: {e}")
        return None

def generate_transaction():
    locations = ["New York", "San Francisco", "London", "Tokyo", "Berlin"]
    users = [f"U{i}" for i in range(1, 100)]
    return {
        "user_id": random.choice(users),
        "amount": round(random.uniform(10.0, 5000.0), 2),
        "location": random.choice(locations),
        "time": datetime.utcnow().strftime("%H:%M"),
        "velocity": round(random.uniform(0.1, 10.0), 2)
    }

def run():
    producer = get_producer()
    if not producer:
        print("Kafka not available. Producer exiting.")
        return
        
    print(f"Producing to {TOPIC} on {KAFKA_BROKER}")
    try:
        while True:
            tx = generate_transaction()
            producer.send(TOPIC, tx)
            print(f"Sent: {tx}")
            time.sleep(2)
    except KeyboardInterrupt:
        print("Stopped by user.")
    finally:
        producer.close()

if __name__ == "__main__":
    run()
