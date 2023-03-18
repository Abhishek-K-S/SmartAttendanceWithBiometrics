import cv2
import numpy as np
import os
import sys
import tensorflow as tf

model_name = "verification.h5"
model = tf.keras.models.load_model('verification.h5')
# trained_file = os.path.join(os.path.abspath(os.getcwd()), "ml", "model", model_name )
# face_recognizer = cv2.face.LBPHFaceRecognizer_create()
# face_recognizer.read(trained_file)

# Load the face classifier
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

# create a VideoCapture object to read from the video file
# 
video_file= 'backend/ml/test/Athul.mp4'


cap = cv2.VideoCapture(video_file)

while True:
    # read a frame from the video
    ret, frame = cap.read()
    # check if the frame was read successfully
    if not ret:
        break
    if face_extractor(frame) is not None:
        face = cv2.resize(face_extractor(frame), (200, 200))
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        test_image = cv2.resize(face, (200, 200))
        test_image = test_image / 255.0

    # predict the class of the test image
        test_image = np.expand_dims(test_image, axis=-1)  # add a dimension for the channel
        test_image = np.expand_dims(test_image, axis=0)  # add a dimension for the batch
        predictions = model.predict(test_image)
        predicted_label_index = np.argmax(predictions)

        print(predicted_label_index)
        print(predictions)
         
    else:
    
        pass