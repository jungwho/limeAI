# OpenAI API 텍스트 생성
import openai

openai.api_key = 'your-api-key'

response = openai.Completion.create(
  engine="text-davinci-003",
  prompt="Hello, how are you?",
  max_tokens=50
)

print(response.choices[0].text.strip())

# Whisper 음성 파일을 텍스트로 변환
import whisper

model = whisper.load_model("base")
result = model.transcribe("audio_file.mp3")
print(result["text"])
