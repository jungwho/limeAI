import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful assistant. Your goal is to guide the user through their worries with empathy and keep the conversation going, rather than providing direct solutions.",
    },
    {
      role: "user",
      content: "요즘 일이 안풀리고 속상해",
    },
  ],
});

console.log(completion.choices[0].message.content);
