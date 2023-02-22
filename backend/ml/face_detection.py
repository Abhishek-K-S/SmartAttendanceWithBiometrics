#Training
#import cv2
# import numpy as np
# from os import listdir
# from os.path import isfile, join
# data_path='/home/dharithri/indecommSmartAttendance/backend/ml/image/'
# onlyfiles=[f for f in listdir(data_path)if isfile(join(data_path))]

# training_data, Lables=[],[]
# for i, files in enumerate(onlyfiles):
#     image_path=data_path+onlyfiles[i]
#     images=cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#     training_data.append(np.array(images,dtype=np.uint))

# Lables=np.array(Lables, dtype=np.int64)
# model=cv2.face.LBPH.Create()
# model.train(np.asarray(training_data), np.asarray(Lables))

# print("Training is completed")
import cv2
import numpy as np
import os

# Path to the folder containing the training data
data_path = '/home/dharithri/indecommSmartAttendance/backend/ml/image'
model_path = '/home/dharithri/indecommSmartAttendance/backend/ml/model'

# Create the model folder if it doesn't exist
if not os.path.exists(model_path):
    os.makedirs(model_path)

# List all subfolders in the data path
subdirs = [f.path for f in os.scandir(data_path) if f.is_dir()]

for subdir in subdirs:
    # Extract the name of the person from the folder name
    person_name = os.path.basename(subdir)
    print("Training for " + person_name)

    # Load the training data for the person
    person_files = [f for f in os.listdir(subdir) if os.path.isfile(os.path.join(subdir, f))]
    training_data = []
    labels = []
    for i, file in enumerate(person_files):
        image_path = os.path.join(subdir, file)
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if image is not None:
            training_data.append(np.asarray(image, dtype=np.uint8))
            labels.append(i)

    # Create the face recognizer model and train it on the training data
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.train(training_data, np.asarray(labels))

    # Save the trained model to a file
    model_file_path = os.path.join(model_path, person_name + '.model')
    face_recognizer.save(model_file_path)

print('Training completed for all users')
