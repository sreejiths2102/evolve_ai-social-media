import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError(
        "OPENROUTER_API_KEY is missing."
    )

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1"
)

def generate_with_openrouter(
    prompt,
    model="tngtech/deepseek-r1:free"
):

    response = (
        client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert social media content creator."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
    )

    return response.choices[0].message.content