from app.services.ai.gemini_service import (
    generate_with_gemini
)

from app.services.ai.groq_service import (
    generate_with_groq
)
from app.services.ai.openrouter_service import (
    generate_with_openrouter
)


def generate_content(prompt):
    providers = [

        (
            "Gemini",
            generate_with_gemini
        ),

        (
            "Groq",
            generate_with_groq
        ),

        (
            "OpenRouter",
            generate_with_openrouter
        ),

    ]

    last_error = None

    for provider_name, provider in providers:

        try:

            print(
                f"Trying {provider_name}..."
            )

            response = provider(
                prompt
            )

            print(
                f"{provider_name} Success"
            )

            return response

        except Exception as e:

            print(
                f"{provider_name} Failed:"
            )

            print(e)

            last_error = e

    raise Exception(
        f"All AI providers failed.\n{last_error}"
    )