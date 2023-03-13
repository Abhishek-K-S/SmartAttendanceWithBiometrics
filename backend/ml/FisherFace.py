import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from scipy.sparse.linalg import svds

def load_face_images(data_path):
    face_images = []
    labels = []
    persons = [os.path.join(data_path, d) for d in os.listdir(data_path) if os.path.isdir(os.path.join(data_path, d))]
    for person in persons:
        for file in os.listdir(person):
            if file.endswith('.jpg') or file.endswith('.png'):
                img = cv2.imread(os.path.join(person, file), cv2.IMREAD_GRAYSCALE)
                img = cv2.resize(img, (128, 128))
                face_images.append(img)
                labels.append(os.path.basename(person))
                print(np.asarray(face_images), np.asarray(labels))
    return np.asarray(face_images), np.asarray(labels)

def preprocess_face_images(face_images):
    mean_face = np.mean(face_images, axis=0)
    face_images = [(img - mean_face) for img in face_images]
    print("Preprocess complete")
    return np.asarray(face_images), mean_face

def extract_face_features(face_images, k=100):
    flattened_images = np.vstack([img.flatten() for img in face_images])
    print("flattened_images shape:", flattened_images.shape)
    covariance_matrix = np.cov(flattened_images.T)

    # Compute the truncated SVD
    n_components = 100  # or choose the number of components you want to keep
    U, s, Vt = svds(covariance_matrix, k=n_components)

    # Compute the eigenvectors and eigenvalues
    eigenvalues = s ** 2
    eigenvectors = Vt.T

    # print("covariabnce done")
    # eigenvalues, eigenvectors = np.linalg.eig(covariance_matrix)
    print("eigenvalues shape:", eigenvalues.shape)
    print("eigenvectors shape:", eigenvectors.shape)
    idx = eigenvalues.argsort()[::-1]
    eigenvectors = eigenvectors[:, idx[:k]]
    features = np.dot(flattened_images, eigenvectors)
    return features, eigenvectors
   


def train_classifier(features, labels):
    print("tarining started")
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    clf = SVC(kernel='linear')
    clf.fit(X_train, y_train)
    print("Training complete")
    return clf

def recognize_face(new_img, mean_face, eigenvectors, clf):
       # Flatten the new image into a 1D array
    new_img_flattened = new_img.flatten()

    # Subtract the mean face from the flattened image
    new_img_centered = new_img_flattened - mean_face

    # Project the centered image onto the eigenface subspace
    new_feature = np.dot(new_img_centered, eigenvectors)

    # Use the classifier to predict the label for the new feature
    predicted_label = clf.predict([new_feature])[0]

    return predicted_label

   
if __name__ == '__main__':
    data_path = 'backend/ml/image'
    face_images, labels = load_face_images(data_path)
    face_images, mean_face = preprocess_face_images(face_images)
    features, eigenvectors = extract_face_features(face_images)
    clf = train_classifier(features, labels)

    new_img = cv2.imread('backend/ml/test/Dharithri.jpeg', cv2.IMREAD_GRAYSCALE)
    predicted_label = recognize_face(new_img, mean_face, eigenvectors, clf)
    print(predicted_label)
