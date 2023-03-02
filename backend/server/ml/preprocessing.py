import cv2
import os
import sys
import numpy as np

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

curr_path = os.path.abspath(os.getcwd())

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
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
            face = cv2.resize(face_ex, (200, 200))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            training_data.append(np.asarray(face, dtype=np.uint8))
            labels.append(count)

        else:
            pass

        if cv2.waitKey(1) == 13 or count == 100:
            break

    cap.release()
    cv2.destroyAllWindows()
    model_file = os.path.join(model_path, name + '.model')
    # Create the face recognizer model and train it on the training data
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.train(training_data, np.asarray(labels))
    face_recognizer.save(model_file)

f_name = sys.argv[1]
uid = sys.argv[2]

if(f_name == None or uid == None):
    exit(1)

vid_path = os.path.join(curr_path, "registration", f_name)
data_generation(uid, vid_path)