import face_recognition as fr
import cv2 as cv
import io
from pymongo import MongoClient
import gridfs
import base64
from io import BytesIO
from PIL import Image
from flask import Flask, jsonify, request
import uuid






app = Flask(__name__)
client = MongoClient("localhost", 27017)
db = client.appDB
fs = gridfs.GridFS(db)

event_name = ""
target_encoding = []

def generate_random_jpg_name():
    random_name = str(uuid.uuid4()) + '.jpg'
    return random_name
def find_target_face():
    global event_name
    data = db.event.find_one({"name": event_name})
    media_files = data['media_files']
    processed_images = []

    for media_id in media_files:
        media_data = fs.get(media_id).read()
        file = fs.get(media_id)
        filename = file.filename
        media_stream = io.BytesIO(media_data)
        image = fr.load_image_file(media_stream)
        face_recognize = process_image(image)
        if face_recognize:
                processed_images.append(media_data)
    return processed_images


def extract_frames_from_video(video_path):
    frames = []
    video = cv.VideoCapture(video_path)

    while True:
        ret, frame = video.read()
        if not ret:
            break
        frames.append(frame)

    return frames



def process_image(image):
    # Decode the base64 image to bytes
    encoded_faces = fr.face_encodings(image)

    if len(encoded_faces) == 0:
        return None

    target_image_data = None

    for encoded_face in encoded_faces:
        # Check if target_encoding exists (assuming it's a global variable)
        if target_encoding is None:
            continue

        # Handle the case when only one face encoding is available
        if target_encoding.ndim == 1:
            is_target_face = fr.compare_faces([target_encoding], encoded_face, tolerance=0.5)
        else:
            is_target_face = fr.compare_faces(target_encoding, encoded_face, tolerance=0.5)

        if True in is_target_face:
            # Convert the processed image (encoded_face) to PIL image
            pil_image = Image.fromarray(encoded_face)

            # Convert the image to RGB mode
            pil_image = pil_image.convert("RGB")

            # Convert the PIL image to bytes in JPEG format
            buffer = io.BytesIO()
            pil_image.save(buffer, format="JPEG")
            target_image_data = buffer.getvalue()

            break  # Exit the loop if a target face is found

    return target_image_data

def render_image(encoded_face):
    rgb_img = cv.cvtColor(encoded_face, cv.COLOR_BGR2RGB)
    cv.imshow('Face Recognition', rgb_img)
    cv.waitKey(0)


@app.route('/api/getImg', methods=['POST'])
def profilePic():
    global event_name, target_encoding
    req = request.get_json()
    print(req)
    user = req['username']
    print(user)
    event_name = req['event_name']
    user_details = db.user.find_one({"user": user})
    profile = user_details["profile"]
    profile_img = fs.get(profile).read()
    decode_profile = fs.get(profile)
    target_image = fr.load_image_file(decode_profile)
    target_encoding = fr.face_encodings(target_image)[0]
    images = find_target_face()
    base64_images = []
    for image_data in images:
        base64_images.append(base64.b64encode(image_data).decode())

    return jsonify({'images': base64_images}), 200


def convert_base64_to_image(base64_string, output_file_path):
    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))
    image = image.convert("RGB")  # Convert image mode to RGB
    image.save(output_file_path)


@app.route('/api/addEvent', methods=['POST'])
def add_event():
    req = request.get_json()
    data = req["formState"]

    event_data = db.event.find_one({"name": data.get('name')})
    if event_data is None:
        db.event.insert_one({
            "name": data.get('name'),
            "address": data.get('address'),
            "city": data.get('city'),
            "country": data.get('country'),
            "about": data.get('about'),
            "organizer": data.get('organizer'),
            "image": data.get('imageBase64'),
            "media_files": []
        })
    return jsonify({}), 200


@app.route('/api/signUp', methods=['POST'])
def sign_up():
    req = request.get_json()
    data = req["formState"]
    db.user.insert_one({
        "name": data.get('name'),
        "user": data.get('user'),
        "email": data.get('email'),
        "password": data.get('password'),
        "profile": "",
    })

    if isinstance(data, dict):
        image_base64 = data.get('imageBase64')
        convert_base64_to_image(image_base64, "output.jpg")
        name = generate_random_jpg_name()
        with open("output.jpg", "rb") as file:
            file_id = fs.put(file, filename=name)  # Use file object instead of string
        update_query = {"$set": {'profile': file_id}}
        db.user.update_one({"user": data.get('user')}, update_query)

    return jsonify({}), 200


@app.route('/api/home', methods=['POST'])
def home():
    page = int(request.json.get('page', 1))
    limit = int(request.json.get('limit', 10))

    skip = (page - 1) * limit

    data = list(db.event.find({}, {'_id': 0, 'about': 0, 'media_files': 0}).skip(skip).limit(limit))

    return jsonify(data), 200


@app.route('/api/eventDetails', methods=['POST'])
def eventDetails():
    req = request.get_json()
    print(req)
    data = db.event.find_one({"name": req['name']}, {'_id': 0, 'media_files': 0})
    return jsonify(data), 200


@app.route('/api/addMedia', methods=['POST'])
def addMedia():
    req = request.get_json()
    datas = req['base64']
    event_name = req['eventName']

    document = db.event.find_one({"name": event_name})
    image_ids = document['media_files']

    for data in datas:
        convert_base64_to_image(data, "output.jpg")
        name = generate_random_jpg_name()

    update_query = {"$set": {'media_files': image_ids}}
    db.event.update_one({"name": event_name}, update_query)

    return ({}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)