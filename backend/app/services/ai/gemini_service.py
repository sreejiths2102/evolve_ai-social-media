import os

from google import genai

client = genai.Client(
    api_key=os.getenv(
        "GOOGLE_API_KEY"
    )
)

def generate_with_gemini(
    prompt
):

    response = (
        client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    )

    return response.text