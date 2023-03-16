import cv2
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras


EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 0.001

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation(f_name, video_path):
    cap = cv2.VideoCapture(video_path)
    count = 0
    training_data = []
    labels = []

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        if face_extractor(frame) is not None:
            count += 1
            face_ex = cv2.resize(face_extractor(frame), (200, 200))
            face_ex = cv2.cvtColor(face_ex, cv2.COLOR_BGR2GRAY)
            training_data.append(face_ex)
            labels.append(f_name)

        if count == 100:
            break
            
    cap.release()
    cv2.destroyAllWindows()
    return np.array(training_data), np.array(labels)


def train_cnn_model(data, labels, num_classes):
    data = data.astype("float32") / 255.0
    print(data)
    print(labels)
    labels = tf.keras.utils.to_categorical(labels, num_classes)
    print(labels)
    data = np.expand_dims(data, axis=-1) # Add an extra dimension to the input data
    model = tf.keras.models.load_model('verification.h5')
    optimizer = tf.keras.optimizers.Adam(lr=LEARNING_RATE)
    model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(data, labels, epochs=EPOCHS, batch_size=BATCH_SIZE)
    return model

video_path = 'backend/ml/test/Athul.mp4'
f_name=0
# training_data = []
# labels = []

# for idx, video_file in enumerate(os.listdir(video_dir)):
#     video_path = os.path.join(video_dir, video_file)
#     f_name = idx 
#     print(f_name)
data, label = data_generation(f_name, video_path)
#     training_data.append(data)
#     labels.append(label)
# print(training_data,labels)
# training_data = np.concatenate(training_data)
# labels = np.concatenate(labels)
num_classes = 1
model = train_cnn_model(data, label, num_classes)
model.save('verification.h5')
