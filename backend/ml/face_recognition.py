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
trained_models={}

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

    # Save the trained model to a file
    model_file_path = os.path.join(model_path, person_name + '.model')
    # Create the face recognizer model and train it on the training data
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.train(training_data, np.asarray(labels))
    face_recognizer.save(model_file_path)
    face_recognizer.read(model_file_path)
    trained_models[person_name] = face_recognizer


print('Training completed for all users')
print(trained_models)

# Load the face classifier
cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

def face_detection(img, size=0.5):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)
    if faces ==():
        return img,[]
    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y),(x+w,y+h),(0,255,0),2)
        roi = img[y:y+h, x:x+w]
        roi = cv2.resize(roi, (200,200))
    return img,roi


cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    image, face = face_detection(frame)
    try:
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        #Here predict is the inbulit function which returns a tuple (name, confidence)
        result_list=[]
        for person_name, face_recognizer in trained_models.items():
                result = face_recognizer.predict(face)
                if result[1] < 500:
                #compares the confidence with the threashold value
                    confidence = int(100 * (1 - (result[1]) / 300))
                    result_list.append((person_name, confidence))

        #Sort tthe list in descending order 
        result_list.sort(key=lambda x: x[1], reverse=True) 
        print(result_list)
        if len(result_list) > 0 and result_list[0][1] > 80:
            # Print the name of the highest confidence one
            cv2.putText(image, result_list[0][0], (250, 450), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 255), 2)
            # Display the image for a few seconds
            cv2.imshow('Face Recognition', image)
            cv2.waitKey(5000)
            # Close the window and release the capture object
            cv2.destroyAllWindows()
            cap.release()
            print(result_list[0][0])  
            break
    except:
        pass
    cv2.imshow('Face Recognition', image)
    if cv2.waitKey(1) == 13:
        break

cap.release()
cv2.destroyAllWindows()

                 
             
            
            
            
            
            
            
            
            
            
            
            
            


