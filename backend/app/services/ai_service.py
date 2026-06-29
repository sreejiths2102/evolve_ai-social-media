from app.services.ai.prompt_builder import (build_post_prompt)
from app.services.ai.ai_router import(generate_content)





def generate_social_post(user, recent_posts):

    prompt=(
        build_post_prompt(user,recent_posts)
    )
    return generate_content(prompt)