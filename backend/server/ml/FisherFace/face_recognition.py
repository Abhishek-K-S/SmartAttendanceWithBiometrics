import cv2
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from scipy.sparse.linalg import svds
import numpy as np
import pickle
from sklearn.svm import SVC
import os 
import sys

FILE_NAME = sys.argv[1]
label = sys.argv[2]

IMG_HEIGHT = 200
IMG_WIDTH = 200


CUR_PATH = os.getcwd()
MODEL_OUTPUT_PATH = os.path.join(CUR_PATH, 'ml', 'FisherFace', 'model')
EIGEN_FOLDER = os.path.join(CUR_PATH, "ml", "FisherFace", "model")

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

def recognize_face(new_img, mean_face, eigenvectors):
    new_img = cv2.resize(new_img, (IMG_HEIGHT, IMG_WIDTH))
    new_img_flattened = new_img.flatten()
    mean_face_1d = mean_face.flatten()
    new_img_centered = new_img_flattened - mean_face_1d
    projection = np.dot(new_img_centered, eigenvectors)
    label = clf.predict([projection])[0]
    return label

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

video_path = os.path.join(CUR_PATH, "verification", FILE_NAME)
if not os.path.exists(video_path):
    exit(1)
cap = cv2.VideoCapture(video_path)
count = 0
with open('classifier.pkl', 'rb') as f:
                clf = pickle.load(f)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    face_ex = face_extractor(frame)
    if face_ex is not None:
        img_to_yuv = cv2.cvtColor(face_ex, cv2.COLOR_BGR2YUV)
        img_to_yuv[:,:,0] = cv2.equalizeHist(img_to_yuv[:,:,0])
        face = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        test_image = cv2.resize(face, (IMG_WIDTH, IMG_HEIGHT))

        current_user_meanface = np.load(os.path.join(EIGEN_FOLDER, label, "mean.npy"))
        current_user_eigenvectors = np.load(os.path.join(EIGEN_FOLDER, label, "eigen.npy"))
            
        predicted_label = recognize_face(test_image,current_user_meanface, current_user_eigenvectors)
        print(predicted_label);
        if predicted_label == label:
             count+=1
    else:
        pass

    if cv2.waitKey(1) == 13 or count == 12:
        print(True)
        break;
cap.release()

