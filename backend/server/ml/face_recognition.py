import cv2
import numpy as np
import os

trained_models = {}

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

                 
             
            
            
            
            
            
            
            
            
            
            
            
            


