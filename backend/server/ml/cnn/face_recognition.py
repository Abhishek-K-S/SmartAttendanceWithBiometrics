import cv2
import numpy as np
import os
import sys
import tensorflow as tf

VIDEO_FILE = sys.argv[1]
video_path = os.path.join(os.getcwd(), "verification", VIDEO_FILE);
USER_ID = sys.argv[2]
USER_ID = int(int(USER_ID[-6:] if len(USER_ID) > 6 else USER_ID, base=36)/10000)

model = tf.keras.models.load_model(os.path.join(os.getcwd(), "ml", "cnn", "model", 'CNNModel.h5'))

# Load the face classifier
cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

def face_detection(img, size=0.5):
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_to_yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    img_to_yuv[:,:,0] = cv2.equalizeHist(img_to_yuv[:,:,0])
    face = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)
    gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    roi = []
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)
    if len(faces)==0:
        return img,[]
    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y),(x+w,y+h),(0,255,0),2)
        roi = img[y:y+h, x:x+w]
        roi = cv2.resize(roi, (200,200))
    return img,roi

cap = cv2.VideoCapture(video_path)
predicted_label_count = 0
count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break;
    image, face = face_detection(frame)
    if len(face) <=1:
        continue
    count+= 1
    try:
        img_to_yuv = cv2.cvtColor(face, cv2.COLOR_BGR2YUV)
        img_to_yuv[:,:,0] = cv2.equalizeHist(img_to_yuv[:,:,0])
        face = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        test_image = cv2.resize(face, (200, 200))
        test_image = test_image / 255.0
        
        test_image = np.expand_dims(test_image, axis=-1)  # add a dimension for the channel
        test_image = np.expand_dims(test_image, axis=0)  # add a dimension for the batch
        predictions = model.predict(test_image)
        predicted_label_index = np.argmax(predictions)

        # print(predicted_label_index, USER_ID)
        if predicted_label_index == USER_ID:
            predicted_label_count += 1
    except:
        pass
    # cv2.imshow('Face Recognition', image)
    if cv2.waitKey(1) == 300 and count >=300:
        break

# result_list.sort(reverse=True)
# best_arr = result_list[0: int(len(result_list)/2)]         
# avg = (sum(best_arr) / len(best_arr)) if len(best_arr) >0 else 0
print(predicted_label_count/count);
if count > 40 and (predicted_label_count / count ) > 0.85:
    print(True)
else:
    print(False)

cap.release()
# cv2.destroyAllWindows()

                 
             
            
            
            
            
            
            
            
            
            
            
            
            


