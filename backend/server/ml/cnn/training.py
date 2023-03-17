import cv2
import os
import sys
import numpy as np
import tensorflow as tf

EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 0.001

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

curr_path = os.path.abspath(os.getcwd())

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation(name, video_path):
    cap = cv2.VideoCapture(video_path)
    count = 0

    model_path = os.path.join(curr_path, "ml", "model")
    training_data = []
    labels = []

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        face_ex = face_extractor(frame)
        if face_ex is not None:
            count += 1
            training_data.append(np.asarray(face_ex, dtype=np.uint8))
            labels.append(count)

        else:
            pass

        if cv2.waitKey(1) == 13 or count == 200:
            break

    cap.release()
    data = training_data.astype("float32") / 255.0
    labels = tf.keras.utils.to_categorical([name,], 1)
    data = np.expand_dims(data, axis=-1)
    model = tf.keras.models.load_model('verification.h5')
    optimizer = tf.keras.optimizers.Adam(lr=LEARNING_RATE)
    model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(data, labels, epochs=EPOCHS, batch_size=BATCH_SIZE)
    model.save('verification.h5')
    print('saved to the file')

f_name = sys.argv[1]
uid = sys.argv[2]

if(f_name == None or uid == None):
    exit(1)

vid_path = os.path.join(curr_path, "registration", f_name)
data_generation(uid, vid_path)