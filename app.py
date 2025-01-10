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
        # Combine all keywords into a single instruction
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
        # Extract generated names assuming a newline-separated response
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
}
# Streamlit app
st.title("🚀 NameWiz")
st.subheader("Generate creative names for your startup, business, or project!")

# User inputs
keywords_input = st.text_input(
    "Enter one or more keywords (e.g., 'table fashion cats'):",
    help="Type keywords separated by any non-alphanumeric symbol (e.g., 'table,fashion|cats').",
)
category = st.selectbox(
    "Select a category:",
    list(categories_with_contexts.keys()),
    help="Pick a theme for the names.",
)
count = st.number_input(
    "Number of names to generate:",
    min_value=1,
    max_value=10,
    value=5,
    step=1,
    help="Choose how many names to generate.",
)
tone = st.radio(
    "Select tone for the names:",
    ["Professional", "Fun/Playful", "Modern/Minimalist", "Luxury/High-End"],
    help="Pick a tone to match your brand personality.",
)

# Generate button
if st.button("Generate Names"):
    if keywords_input:
        # Split keywords by any non-alphanumeric character
        keywords = re.split(r"[^a-zA-Z0-9]+", keywords_input)
        # Remove any empty keywords
        keywords = [kw.strip() for kw in keywords if kw.strip()]

        # Handle large keyword sets
        max_keywords = 10
        if len(keywords) > max_keywords:
            st.warning(
                f"Too many keywords! Only the first {max_keywords} will be used."
            )
            keywords = keywords[:max_keywords]

        if keywords:
            context = categories_with_contexts[
                category
            ]  # Automatically fetch context based on category
            with st.spinner("Generating names..."):  # Add a loading spinner
                names = call_model(keywords, category, count, tone, context)
                st.markdown("### Generated Names:")
                for idx, name in enumerate(names, 1):
                    # Clean up any numbering or whitespace
                    clean_name = name.lstrip("0123456789. ").strip()
                    st.write(f"{idx}. {clean_name}")
        else:
            st.error("Please enter at least one valid keyword.")
    else:
        st.error("Please enter one or more keywords.")
