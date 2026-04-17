import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
import pandas as pd

def build_autoencoder(input_dim):
    # Input->64->32->16->32->64->Output
    input_layer = layers.Input(shape=(input_dim,))
    
    # Encoder
    x = layers.Dense(64, activation="relu")(input_layer)
    x = layers.Dense(32, activation="relu")(x)
    encoded = layers.Dense(16, activation="relu")(x)
    
    # Decoder
    x = layers.Dense(32, activation="relu")(encoded)
    x = layers.Dense(64, activation="relu")(x)
    decoded = layers.Dense(input_dim, activation="linear")(x)
    
    autoencoder = models.Model(inputs=input_layer, outputs=decoded)
    autoencoder.compile(optimizer='adam', loss='mse')
    return autoencoder

def train_autoencoder():
    print("Training autoencoder...")
    # Dummy normal transactions (label 0)
    np.random.seed(42)
    X_normal = np.random.normal(loc=0, scale=1, size=(5000, 7))
    
    autoencoder = build_autoencoder(7)
    
    print("Fitting model...")
    autoencoder.fit(
        X_normal, X_normal,
        epochs=10,
        batch_size=32,
        validation_split=0.2,
        verbose=1
    )
    
    autoencoder.save('autoencoder.h5')
    print("Autoencoder saved to autoencoder.h5")

if __name__ == "__main__":
    train_autoencoder()
