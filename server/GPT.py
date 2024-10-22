from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

class GPT:
    def __init__(self):
        OpenAI.api_key = os.environ.get("OPENAI_API_KEY")
        self.client = OpenAI()
        self.messages = []

    def add_message(self, role, content):
        message = {"role" : role, "content" : content}
        self.messages.append(message)

    def get_gpt_json(self):
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=self.messages
        )
        return response.choices[0].message.content


# GPT 클래스의 인스턴스 생성
gpt = GPT()

# 인스턴스를 통해 메서드 호출
gpt.add_message("user", "나 너무 우울해")
gpt.add_message("system", "당신은 상담가입니다")
print(gpt.get_gpt_json())
