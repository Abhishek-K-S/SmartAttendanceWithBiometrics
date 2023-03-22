import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from scipy.sparse.linalg import svds
import os 
import sys
import pickle

FILE_NAME = sys.argv[1]
USER_ID = sys.argv[2]

CUR_PATH = os.getcwd()
MODEL_OUTPUT_PATH = os.path.join(CUR_PATH, 'ml', 'FisherFace', 'model')
EIGEN_FOLDER = os.path.join(CUR_PATH, "ml", "FisherFace", "model")

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

IMG_HEIGHT = 200
IMG_WIDTH = 200

if not os.path.exists(MODEL_OUTPUT_PATH):
    os.mkdir(MODEL_OUTPUT_PATH)

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation():
    video_path = os.path.join(CUR_PATH, "registration", FILE_NAME)
    if not os.path.exists(video_path):
        exit(1)
    cap = cv2.VideoCapture(video_path)
    count = 0
    data = []

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
            data.append(face)
        else:
            pass

        if cv2.waitKey(1) == 13 or count == 12:
            break
    cap.release()

    if(len(data) <10):
        exit(1)
    return data

def preprocess_face_images(face_images):
    mean_face = np.mean(face_images, axis=0)
    face_images = [(img - mean_face) for img in face_images]
    return np.asarray(face_images), mean_face

def extract_face_features(face_images, k=100):
    flattened_images = np.vstack([img.flatten() for img in face_images])
    covariance_matrix = np.cov(flattened_images.T)

    n_components = 50 
    U, s, Vt = svds(covariance_matrix, k=n_components)
    eigenvalues = s ** 2
    eigenvectors = Vt.T
    idx = eigenvalues.argsort()[::-1]
    eigenvectors = eigenvectors[:, idx[:k]]
    features = np.dot(flattened_images, eigenvectors)
    return features, eigenvectors

def save_eigenvectors_and_features(eigenvectors, features, label, eigenvectors_folder_path,mean_face):
    if not os.path.exists(eigenvectors_folder_path):
        os.makedirs(eigenvectors_folder_path)
    
    folder_path = os.path.join(eigenvectors_folder_path, label)
    os.makedirs(folder_path, exist_ok=True)

    np.save(os.path.join(folder_path, f"mean.npy"), mean_face)
    np.save(os.path.join(folder_path, f"eigen.npy"), eigenvectors)
    np.save(os.path.join(folder_path, f"features.npy"), features)
    print('models saved')

def training():
    user_ids = []
    features_list = []
# Loop through each subdirectory inside the eigen directory
    for subdir in os.listdir(EIGEN_FOLDER):
        subdir_path = os.path.join(EIGEN_FOLDER, subdir)
        if not os.path.isdir(subdir_path):
            continue

        # Loop through each file inside the subdirectory
        if "features.npy" in os.listdir(subdir_path):
            feature_file = np.load(os.path.join(subdir_path,"features.npy"))
            features_list.append(feature_file)
            print('found user ', subdir)
            user_ids.append(subdir)
    X = np.concatenate(features_list, axis=0)
    y = np.concatenate([np.full(len(f), str(user_ids[i]))
                    for i, f in enumerate(features_list)], axis=0)
    
    print('x is ',X)
    print('y is ', y)
    clf = SVC()
    clf.fit(X, y)
    print('Training complete')
    with open('classifier.pkl', 'wb') as f:
        pickle.dump(clf, f)

face_images = data_generation();
label = USER_ID
face_images, mean_face = preprocess_face_images(face_images)
features, eigenvector = extract_face_features(face_images)
save_eigenvectors_and_features(eigenvector, features, label, EIGEN_FOLDER, mean_face)
training()

