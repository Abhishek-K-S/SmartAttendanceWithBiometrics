
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from scipy.sparse.linalg import svds
import os 
import pickle

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

    n_components = 100  
    U, s, Vt = svds(covariance_matrix, k=n_components)

    eigenvalues = s ** 2
    eigenvectors = Vt.T

    print("eigenvalues shape:", eigenvalues.shape)
    print("eigenvectors shape:", eigenvectors.shape)
    idx = eigenvalues.argsort()[::-1]
    eigenvectors = eigenvectors[:, idx[:k]]
    features = np.dot(flattened_images, eigenvectors)
    return features, eigenvectors
   

def save_eigenvectors_and_features(eigenvectors, features, label, eigenvectors_folder_path,mean_face):
    if not os.path.exists(eigenvectors_folder_path):
        os.makedirs(eigenvectors_folder_path)
    
    folder_path = os.path.join(eigenvectors_folder_path, '_'.join(label))
    os.makedirs(folder_path, exist_ok=True)
    print(folder_path)

    np.save(os.path.join(folder_path, f"mean_{label}.npy"), mean_face)
    np.save(os.path.join(folder_path, f"eigen_{label}.npy"), eigenvectors)
    np.save(os.path.join(folder_path, f"features_{label}.npy"), features)
    print("files created")



def training():
# Loop through each subdirectory inside the eigen directory
    for subdir in os.listdir(eigen_dir):
        subdir_path = os.path.join(eigen_dir, subdir)
        if not os.path.isdir(subdir_path):
            continue

        # Loop through each file inside the subdirectory
        for filename in os.listdir(subdir_path):
            filepath = os.path.join(subdir_path, filename)

            # Check if the file is of the form eigen_[user_id] or feature_[user_id]
            if not (filename.startswith("eigen_") or filename.startswith("feature_")):
                continue

            # Extract the user ID from the filename
            user_id = filename.split("[")[1].split("]")[0]
            feature_file = np.load(os.path.join(
                subdir_path, f"features_[{user_id}].npy"))
            features.append(feature_file)
            user_ids.append(user_id)

    print(user_ids)

    X = np.concatenate(features, axis=0)
    y = np.concatenate([np.full(len(f), str(user_ids[i]))
                    for i, f in enumerate(features)], axis=0)

    print(y)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    # Train a model using the training set
    clf = SVC()
    clf.fit(X_train, y_train)
    print('Training complete')
    with open('classifier.pkl', 'wb') as f:
        pickle.dump(clf, f)


if __name__ == '__main__':
    data_path = "backend/ml/image"
    eigenvectors_folder_path = "backend/ml/Eigen"
    face_images, labels = load_face_images(data_path)
    print("Received label")
    label = np.unique(labels)
    print("Hello",label)
    face_images, mean_face = preprocess_face_images(face_images)
    features, eigenvectors = extract_face_features(face_images)
    save_eigenvectors_and_features(eigenvectors, features, label, eigenvectors_folder_path,mean_face)

    features = []
    eigen_dir = "backend/ml/Eigen"
    user_ids = []

    training()