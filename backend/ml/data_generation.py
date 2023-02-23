import cv2
import os

face_classifier = cv2.CascadeClassifier('/home/dharithri/indecommSmartAttendance/backend/ml/haarcascade_frontalface_default.xml')

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation(name):
    cap = cv2.VideoCapture(0)
    count = 0

    folder_path = '/home/dharithri/indecommSmartAttendance/backend/ml/image/' + name
    os.makedirs(folder_path, exist_ok=True)

    while True:
        ret, frame = cap.read()

        if face_extractor(frame) is not None:
            count += 1
            face = cv2.resize(face_extractor(frame), (200, 200))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            file_name_path = folder_path + '/' + name + '_' + str(count) + '.jpg'
            cv2.imwrite(file_name_path, face)
            cv2.putText(face, str(count), (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow('Face Cropper', face)

        else:
            print("Face not found")
            pass

        if cv2.waitKey(1) == 13 or count == 100:
            break

    cap.release()
    cv2.destroyAllWindows()
    print('Data collection completed for ' + name)

name = input("Enter name of agent: ")
data_generation(name)


