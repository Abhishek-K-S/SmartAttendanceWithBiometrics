import cv2
import numpy as np
import os
import sys

# Path to the folder containing the training data
curr_path = os.path.abspath(os.getcwd())
data_path = os.path.join(curr_path, 'ml/image')
model_path = os.path.join(curr_path, 'ml/model')
person_name = os.path.splitext(os.path.basename(sys.argv[1]))[0]

# Create the model folder if it doesn't exist
if not os.path.exists(model_path):
    os.makedirs(model_path)

#path to files
person_folder = os.path.join(data_path, person_name)
if not os.path.exists(person_folder):
    exit(404) #person details doesn't exixts


print("Training for " + person_name)

# Load the training data for the person
person_files = [f for f in os.listdir(person_folder) if os.path.isfile(os.path.join(person_folder, f))]
training_data = []
labels = []
for i, file in enumerate(person_files):
    image_path = os.path.join(person_folder, file)
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is not None:
        training_data.append(np.asarray(image, dtype=np.uint8))
        labels.append(i)

# Save the trained model to a file
model_file_path = os.path.join(model_path, person_name + '.model')
# Create the face recognizer model and train it on the training data
face_recognizer = cv2.face.LBPHFaceRecognizer_create()
face_recognizer.train(training_data, np.asarray(labels))
face_recognizer.save(model_file_path)
# face_recognizer.read(model_file_path)

exit(0)