from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import tempfile
import os
import shutil
from threading import Lock
from sahi.utils.yolov8 import download_yolov8s_model
from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction

yolov8_model_path = 'best.pt'
download_yolov8s_model(yolov8_model_path)

# Global Configs
model_type = "yolov8"
model_path = yolov8_model_path
model_device = "cpu" # or 'cuda:0'
model_confidence_threshold = 0.2

slice_height = 640
slice_width = 640
overlap_height_ratio = 0.2
overlap_width_ratio = 0.2
progress = 0
last_dir = ''
last_name = ''
repetitive_checker_name = ''
progress_lock = Lock()

# Deep Learning Model
detection_model = AutoDetectionModel.from_pretrained(
    model_type=model_type,
    model_path=model_path,
    confidence_threshold=model_confidence_threshold,
    device=model_device, # or 'cuda:0'
)

# Create the Flask app
app = Flask(__name__, static_folder='../Frontend Dark/frontend/')
CORS(app)

# Routes
# Receive video upload and return the processed video
@app.route('/upload_video', methods=['POST'])
def upload_video():
    #Initialize progress percentage
    global progress
    progress = 0
    
    video_file = request.files['video-file']
    if video_file:
        # Save the file to a temporary file
        temp_video_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        video_file.save(temp_video_file.name)

        # Pre-process and Prediction
        zip_path = process_video(temp_video_file.name)

        # Clean up the temporary video file
        os.remove(temp_video_file.name)

        # Send the zip file to the client
        return send_file(zip_path, as_attachment=True, download_name='inference_results.zip')

    return jsonify({"error": "No video file provided"}), 400

# Return the percentage of progress
@app.route('/value', methods=['GET'])
def get_progress():
    with progress_lock:
        return jsonify({"value": progress})
    
#Return the preview image
@app.route('/preview')
def get_preview():
    global repetitive_checker_name
    
    with progress_lock:
        # Check if no picture with human activity has been detected / last picture has been returned
        if last_dir == '' or last_name == '' or repetitive_checker_name == last_name:
            return jsonify({"error": "No preview available"})
        
        repetitive_checker_name = last_name
        return send_from_directory(last_dir, last_name + '.png')

# Decode the video and extract the frames, feed the frames into model, and return a zip file of detection results
def process_video(video_path):

    global progress 
    global last_dir
    global last_name
    
    last_dir = ''
    last_name = ''
    progress = 0
    
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_id = 0
    
    # Create a temporary directory to store images
    temp_dir = tempfile.mkdtemp()
    frame_name = ''
    
    # Get the total number of frames, used for progress calculation
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    while True:
        
        # Read the next frame
        success, frame = cap.read()
        
        # Break if no more frames
        if not success:
            break
        if frame_id % 30 == 0:  # Process only every 30th frame, can be adjusted easily by changing the number
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Inference with SAHI, slice the frame, get the prediction and merge the results
            result = get_sliced_prediction(
                frame_rgb,
                detection_model,
                slice_height = slice_height,
                slice_width = slice_width,
                overlap_height_ratio = overlap_height_ratio,
                overlap_width_ratio = overlap_width_ratio
            )

            # Save the frame if objects detected
            if result.object_prediction_list != []:
                
                frame_sec = frame_id / fps
                hours, remaining_seconds = divmod(frame_sec, 3600)
                minutes, seconds = divmod(remaining_seconds, 60)
                frame_name = f'frame_at_{int(hours)}h{int(minutes)}m{seconds:.1f}s'
                result.export_visuals(export_dir=temp_dir, file_name=frame_name)

            with progress_lock:
                
                # Update the progress, last picture detected for progress and preview image
                last_dir = temp_dir
                last_name = frame_name
                progress = (frame_id / total_frames) * 100
                
        # Increment the frame ID            
        frame_id += 1

    # Release the video capture
    cap.release()

    # Zip the results
    zip_filename = os.path.join(tempfile.gettempdir(), 'inference_results.zip')
    shutil.make_archive(base_name=zip_filename[:-4], format='zip', root_dir=temp_dir)

    # Clean up the temporary directory
    shutil.rmtree(temp_dir)

    # Set the progress to 100
    with progress_lock:
        progress = 100

    return zip_filename

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=81)