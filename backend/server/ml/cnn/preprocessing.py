import os
import sys
import tensorflow as tf
from tensorflow import keras
import numpy as np
import cv2

FILE_NAME = sys.argv[1]
USER_ID = sys.argv[2]

CUR_PATH = os.getcwd()
FACE_DATASET_PATH = os.path.join(CUR_PATH, 'ml', 'cnn', 'image')
MODEL_OUTPUT_PATH = os.path.join(CUR_PATH, 'ml', 'cnn', 'model')

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

if not os.path.exists(FACE_DATASET_PATH):
    os.mkdir(FACE_DATASET_PATH)

if not os.path.exists(MODEL_OUTPUT_PATH):
    os.mkdir(MODEL_OUTPUT_PATH)

IMG_HEIGHT = 200
IMG_WIDTH = 200

# NUM_CLASS = len(os.listdir(FACE_DATASET_PATH)) + 1
NUM_CLASS = 1000000

EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 0.002
label_to_int = {}

def create_face_dataset():
    print()

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation(name):
    video_path = os.path.join(CUR_PATH, "registration", FILE_NAME)
    if not os.path.exists(video_path):
        exit(1)
    cap = cv2.VideoCapture(video_path)
    count = 0

    folder_path = os.path.join(FACE_DATASET_PATH, name)
    os.makedirs(folder_path, exist_ok=True)

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        face_ex = face_extractor(frame)
        if face_ex is not None:
            count += 1
            img_to_yuv = cv2.cvtColor(face_ex, cv2.COLOR_BGR2YUV)
            img_to_yuv[:,:,0] = cv2.equalizeHist(img_to_yuv[:,:,0])
            face = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            face = cv2.resize(face, (IMG_WIDTH, IMG_HEIGHT))
            file_name_path = folder_path + '/' + name + '_' + str(count) + '.jpg'
            cv2.imwrite(file_name_path, face)

        else:
            pass

        if cv2.waitKey(1) == 13 or count == 300:
            break
    cap.release()

def load_face_dataset():
    data = []
    labels = []
    for folder in os.listdir(FACE_DATASET_PATH):
        folder_path = os.path.join(FACE_DATASET_PATH, folder)
        if os.path.isdir(folder_path):
            for filename in os.listdir(folder_path):
                image_path = os.path.join(folder_path, filename)
                image = cv2.imread(image_path)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                image = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
                data.append(image)
                labels.append(folder)
    labels = np.array(labels)
    return np.array(data), labels

def preprocess_face_dataset(data, labels):
    data = data.astype("float32") / 255.0
    labels = [int(x[-6:] if len(x) > 6 else x, base=36)/10000 for x in labels]
    labels = tf.keras.utils.to_categorical(labels, NUM_CLASS)
    data = np.expand_dims(data, axis=-1) # Add an extra dimension to the input data
    return data, labels

def create_cnn_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(IMG_HEIGHT, IMG_WIDTH, 1)), # Set input shape to (IMG_HEIGHT, IMG_WIDTH, 1) with one channel
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dense(NUM_CLASS, activation="softmax")
    ])
    return model

# Train the CNN model
def train_cnn_model(data, labels):
    model = create_cnn_model()
    optimizer = tf.keras.optimizers.Adam(lr=LEARNING_RATE)
    # , loss="categorical_crossentropy"
    model.compile(optimizer=optimizer, loss="categorical_crossentropy" ,metrics=["accuracy"])
    model.fit(data, labels, epochs=EPOCHS, batch_size=BATCH_SIZE)
    return model

# Save the trained model
def save_model(model):
    model.save(os.path.join(MODEL_OUTPUT_PATH, "CNNModel.h5"))


data_generation(USER_ID)

data, labels = load_face_dataset()
print(labels[0])

data, labels = preprocess_face_dataset(data, labels)
print(labels[0])
#print(labels)

# Train the CNN model
model = train_cnn_model(data, labels)

# Save the trained model
save_model(model)
print('model created');