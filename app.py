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
    api_key=os.getenv("GITHUB_TOKEN"),  # Read the token from .env file
)


# Function to call the real model
def call_model(keywords, category, count, tone):
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
                        f"based on the combined keywords '{combined_keywords}' in the '{category}' category."
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
        return [f"Error: {str(e)}"]


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
    ["General", "Tech", "Fashion", "Food"],
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
        if keywords:
            # Generate names based on all keywords combined
            st.markdown("### Generated Names:")
            names = call_model(keywords, category, count, tone)
            for idx, name in enumerate(names, 1):
                # Clean up any numbering or whitespace
                clean_name = name.lstrip("0123456789. ").strip()
                st.write(f"{idx}. {clean_name}")
        else:
            st.error("Please enter at least one valid keyword.")
    else:
        st.error("Please enter one or more keywords.")
