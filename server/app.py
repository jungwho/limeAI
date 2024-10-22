from flask import Flask

def create_app():
    app = Flask(__name__)

    import whisper_api
    app.register_blueprint(whisper_api.bp)
  

    return app
