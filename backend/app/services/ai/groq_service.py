import os

from openai import OpenAI

client = OpenAI(
    api_key=os.getenv(
        "GROQ_API_KEY"
    ),
    base_url=
    "https://api.groq.com/openai/v1"
)


def generate_with_groq(
    prompt
):

    response = (
        client.responses.create(
            model="openai/gpt-oss-20b",
            input=prompt
        )
    )

    return response.output_text