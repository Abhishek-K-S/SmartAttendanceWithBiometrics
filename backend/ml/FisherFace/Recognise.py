

import cv2
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from scipy.sparse.linalg import svds
import numpy as np
import pickle
from sklearn.svm import SVC
import os 



def recognize_face(new_img, mean_face, eigenvectors, clf_path):
    new_img = cv2.resize(new_img, (128, 128))
    new_img_flattened = new_img.flatten()
    mean_face_1d = mean_face.flatten()
    new_img_centered = new_img_flattened - mean_face_1d
    projection = np.dot(new_img_centered, eigenvectors)
    label = clf.predict([projection])[0]
    return label



def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face


if __name__ == '__main__':
    cascade_dir = os.path.join(os.path.dirname(
    cv2.__file__), "data", "haarcascade_frontalface_default.xml")
    face_classifier = cv2.CascadeClassifier(cascade_dir)
    eigenfaces_dir = 'backend/ml/Eigen'
    video_file ='backend/ml/test/.mp4'
    label = os.path.splitext(os.path.basename(video_file))[0]
    print(label)
    cap = cv2.VideoCapture(video_file)
    # predicted_label_counts = {}


    while True:
        # read a frame from the video
        ret, frame = cap.read()
        if not ret:
            break
        if face_extractor(frame) is not None:
            face = cv2.resize(face_extractor(frame), (128, 128))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            test_image = cv2.resize(face, (128, 128))
            with open('classifier.pkl', 'rb') as f:
                clf = pickle.load(f)
            current_user_meanface = np.load(os.path.join(eigenfaces_dir, label, f"mean_['{label}'].npy"))
            current_user_eigenvectors = np.load(os.path.join(eigenfaces_dir, label, f"eigen_['{label}'].npy"))
                
            predicted_label = recognize_face(test_image,current_user_meanface, current_user_eigenvectors, clf)
            print("Recognised face is :",predicted_label)


        else:
            pass

    
    #  predicted_label_counts = {}

    # if predicted_label[0] in predicted_label_counts:
    #     predicted_label_counts[predicted_label[0]] += 1
    # else:
    #     predicted_label_counts[predicted_label[0]] = 1

    # threshold = 10

    # for label, count in predicted_label_counts.items():
    #     if count >= threshold:
    #         print(f"Recognized face {label} is present {count} times, exceeding threshold of {threshold}")
