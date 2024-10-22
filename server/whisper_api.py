from flask import Blueprint, request, jsonify
from flask_cors import CORS  # 추가
import whisper
import os
from GPT import GPT

bp = Blueprint('whisper_api', __name__, url_prefix='/')
CORS(bp)  # CORS를 허용

# Whisper 모델 불러오기
model = whisper.load_model("base")  # Whisper 모델 선택
gpt = GPT()

@bp.route('/whisper', methods=['POST'])
def whisper_transcribe():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # 파일을 서버에 저장
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Whisper 모델로 오디오 파일 변환
    result = model.transcribe(file_path)
    text = result['text']
    gpt.add_message("system", "당신은 상담가입니다")
    gpt.add_message("user", text)
    res = gpt.get_gpt_json()

    
    return jsonify({"response": res})

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    bp.run(host='0.0.0.0', port=5000)
