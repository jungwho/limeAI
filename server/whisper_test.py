import whisper

model = whisper.load_model("base")
result = model.transcribe("sample.m4a")
print(result["text"])