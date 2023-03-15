import tensorflow as tf
import os


MODEL_OUTPUT_PATH = os.path.abspath(os.getcwd())

def create_cnn_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(200, 200, 1)), # Set input shape to (IMG_HEIGHT, IMG_WIDTH, 1) with one channel
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dense(1, activation="softmax")
    ])
    model.save("verification.h5")
