import cv2
import os
import time
import watchdog.events
import watchdog.observers

cascade_dir = os.path.join(os.path.dirname(cv2.__file__), "data", "haarcascade_frontalface_default.xml")
face_classifier = cv2.CascadeClassifier(cascade_dir)

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    if faces == ():
        return None

    for (x, y, w, h) in faces:
        cropped_face = img[y:y+h, x:x+w]

    return cropped_face

def data_generation(name, video_path):
    cap = cv2.VideoCapture(video_path)
    count = 0

    folder_path = '/home/dharithri/indecommSmartAttendance/backend/ml/image/' + name
    os.makedirs(folder_path, exist_ok=True)

    while True:
        ret, frame = cap.read()

        if not ret:
            break

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

        if cv2.waitKey(1) == 13 or count == 10:
            break

    cap.release()
    cv2.destroyAllWindows()
    print('Data collection completed for ' + name)

def watch_folder(folder_path):
    class NewFileHandler(watchdog.events.PatternMatchingEventHandler):
        def on_created(self, event):
            if event.is_directory:
                return
            if event.src_path.endswith('.mp4'):
                name = os.path.splitext(os.path.basename(event.src_path))[0]
                data_generation(name, event.src_path)
    
    observer = watchdog.observers.Observer()
    event_handler = NewFileHandler(patterns=['*.mp4'])
    observer.schedule(event_handler, folder_path, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(5)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

folder_path = '/home/dharithri/indecommSmartAttendance/backend/ml/Video/'
watch_folder(folder_path)