import numpy as np
import cv2
import os
import tensorflow as tf
from tensorflow import keras

# Define the paths to the face dataset and output model
FACE_DATASET_PATH = "backend/ml/image"
MODEL_OUTPUT_PATH = "backend/ml/new_model"

# Define the dimensions of the input images
IMG_HEIGHT = 200
IMG_WIDTH = 200

# Define the hyperparameters of the model
NUM_CLASSES = len(os.listdir(FACE_DATASET_PATH))
print(NUM_CLASSES)
EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 0.001
label_to_int = {}

def load_face_dataset():
    data = []
    labels = []
    #label_to_int = {}
    for folder in os.listdir(FACE_DATASET_PATH):
        folder_path = os.path.join(FACE_DATASET_PATH, folder)
        if os.path.isdir(folder_path):
            if folder not in label_to_int:
                label_to_int[folder] = len(label_to_int)
            for filename in os.listdir(folder_path):
                image_path = os.path.join(folder_path, filename)
                image = cv2.imread(image_path)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                image = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
                data.append(image)
                labels.append(label_to_int[folder])
    labels = np.array(labels)
    print(labels)
    return np.array(data), labels

def preprocess_face_dataset(data, labels):
    data = data.astype("float32") / 255.0
    print(data)
    print(labels)
    print(NUM_CLASSES)
    labels = tf.keras.utils.to_categorical(labels, NUM_CLASSES)
    print(labels)
    data = np.expand_dims(data, axis=-1) # Add an extra dimension to the input data
    return data, labels

# Define the CNN model architecture
def create_cnn_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(IMG_HEIGHT, IMG_WIDTH, 1)), # Set input shape to (IMG_HEIGHT, IMG_WIDTH, 1) with one channel
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dense(NUM_CLASSES, activation="softmax")
    ])
    return model

# Train the CNN model
def train_cnn_model(data, labels):
    model = create_cnn_model()
    optimizer = tf.keras.optimizers.Adam(lr=LEARNING_RATE)
    model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(data, labels, epochs=EPOCHS, batch_size=BATCH_SIZE)
    return model

# Save the trained model
def save_model(model):
    model.save(MODEL_OUTPUT_PATH)

# Load the face dataset
data, labels = load_face_dataset()

# Preprocess the face dataset
data, labels = preprocess_face_dataset(data, labels)
#print(labels)

# Train the CNN model
model = train_cnn_model(data, labels)

# Save the trained model
save_model(model)
folder_path = 'backend/ml/new_model'


cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

video_path = 'backend/ml/Video/Athul.mp4'


def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

# create a VideoCapture object to read from the video file
cap = cv2.VideoCapture(video_path)
predicted_label=" "

while True:
    # read a frame from the video
    ret, frame = cap.read()
    # check if the frame was read successfully
    if not ret:
        break
    if face_extractor(frame) is not None:
        face = cv2.resize(face_extractor(frame), (200, 200))
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        test_image = cv2.resize(face, (IMG_HEIGHT, IMG_WIDTH))
        test_image = test_image / 255.0

    # predict the class of the test image
        test_image = np.expand_dims(test_image, axis=-1)  # add a dimension for the channel
        test_image = np.expand_dims(test_image, axis=0)  # add a dimension for the batch
        predictions = model.predict(test_image)
        label_names = {v: k for k, v in label_to_int.items()} 
        predicted_label_index = np.argmax(predictions)

        if predicted_label_index in label_names:
            predicted_label = label_names[predicted_label_index]
         
    else:
    
        pass
  
print("Recognised Face:", predicted_label)