import streamlit as st
import os
import re
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_TOKEN"),
)


# Function to call the real model
def call_model(keywords, category, count, tone, context):
    try:
        combined_keywords = ", ".join(keywords)
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
                },
                {
                    "role": "user",
                    "content": (
                        f"Generate {count} unique and {tone} business names "
                        f"based on the combined keywords '{combined_keywords}' in the '{category}' category. "
                        f"Context: {context}"
                    ),
                },
            ],
            model="gpt-4o",
            temperature=1,
            max_tokens=150,
            top_p=1,
        )
        return response.choices[0].message.content.split("\n")
    except Exception as e:
        if "authentication" in str(e).lower():
            return ["Error: Invalid or missing GITHUB_TOKEN."]
        elif "rate limit" in str(e).lower():
            return ["Error: API rate limit exceeded. Please try again later."]
        else:
            return [f"Error: {str(e)}"]


# Category and context mapping
categories_with_contexts = {
    "General": "Versatile, creative, and adaptable.",
    "Tech Startup": "Futuristic, innovative, and sleek.",
    "Fashion": "Trendy, elegant, and stylish.",
    "Food": "Delicious, appetizing, and fun.",
    "Eco-Friendly": "Sustainable, green, and nature-inspired.",
    "Finance": "Trustworthy, professional, and growth-focused.",
    "Health": "Healthy, reliable, and caring.",
    "Education": "Knowledgeable, inspiring, and engaging.",
    "Travel": "Adventurous, exciting, and global.",
    "Gaming": "Energetic, fun, and immersive.",
    "Blog": "Creative, expressive, and memorable for your personal or professional blog.",
    "E-Commerce": "Catchy, appealing, and market-ready for online stores.",
    "Real Estate": "Professional, trustworthy, and location-focused.",
    "Art & Design": "Innovative, stylish, and visually inspiring.",
    "Social Media": "Trendy, relatable, and shareable.",
    "Sports & Fitness": "Energetic, motivational, and goal-oriented.",
    "Non-Profit": "Purposeful, inspiring, and community-focused.",
    "Entertainment": "Fun, engaging, and memorable.",
    "Photography": "Creative, timeless, and visually appealing.",
    "Technology Services": "Cutting-edge, reliable, and innovative.",
    "Hindi": "Creative and innovative names inspired by Hindi culture and language.",
}

# Fancy Header
st.markdown(
    """
    <div style="text-align: center;">
        <h1>🚀 <span style="color: #ff4b4b;">NameWiz</span></h1>
        <h3>Generate creative names for your startup, business, or project!</h3>
    </div>
    <hr style="border:1px solid #f2f2f2;">
    """,
    unsafe_allow_html=True,
)

# Center the page layout
st.markdown(
    """
    <style>
    .css-1d391kg {padding: 5rem 1rem;}
    .css-18ni7ap {padding: 2rem 1rem;}
    </style>
    """,
    unsafe_allow_html=True,
)

# User inputs with icons
st.text_input(
    "📝 Enter one or more keywords (e.g., 'table fashion cats'):",
    help="Type keywords separated by any non-alphanumeric symbol (e.g., 'table,fashion|cats').",
    key="keywords",
)
languages = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Chinese (Simplified)": "zh",
    "Japanese": "ja",
    "Korean": "ko",
    "Portuguese": "pt",
    "Italian": "it",
    "Hindi": "hi",
    "Polish": "pl",
    "Dutch": "nl",
}
category = st.selectbox(
    "🎨 Select a category:",
    list(categories_with_contexts.keys()),
    help="Pick a theme for the names.",
    key="category",
)
count = st.slider(
    "🔢 Number of names to generate:",
    min_value=1,
    max_value=10,
    value=5,
    step=1,
    help="Choose how many names to generate.",
    key="count",
)

with st.expander("⚙️ Advanced Settings"):
    tone = st.radio(
        "🎭 Select tone for the names:",
        ["Professional", "Fun/Playful", "Modern/Minimalist", "Luxury/High-End"],
        help="Pick a tone to match your brand personality.",
    )
    language = st.selectbox(
        "🌍 Select a language:",
        languages,
        help="Choose the language for the generated names.",
    )

if st.button("Generate Names"):
    keywords_input = st.session_state["keywords"]
    if keywords_input:
        keywords = re.split(r"[^a-zA-Z0-9]+", keywords_input)
        keywords = [kw.strip() for kw in keywords if kw.strip()]

        if len(keywords) > 10:
            st.warning("⚠️ Too many keywords! Only the first 10 will be used.")
            keywords = keywords[:10]

        if keywords:
            context = categories_with_contexts[category]
            selected_language = languages[language]  # Add the selected language
            with st.spinner("✨ Generating names..."):
                # Include language in the prompt
                names = call_model(
                    keywords,
                    category,
                    count,
                    tone,
                    f"{context} Generate names in {language} ({selected_language}).",
                )
                st.markdown("### 🎉 Generated Names:")
                st.write(
                    "\n".join(
                        [
                            f"{i+1}. {name.lstrip('0123456789. ').strip()}"
                            for i, name in enumerate(names)
                        ]
                    )
                )
        else:
            st.error("❌ Please enter valid keywords.")
    else:
        st.error("❌ Please enter one or more keywords.")
