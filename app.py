import streamlit as st
import os
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
def call_model(prompt):
    try:
        # Construct model input from prompt
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
                },
                {
                    "role": "user",
                    "content": (
                        f"Generate {prompt['count']} unique and {prompt['tone']} business names "
                        f"based on the keyword '{prompt['keyword']}' in the '{prompt['category']}' category."
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
        return [f"Error: {str(e)}"]


# Streamlit app
st.title("🚀 NameWiz")
st.subheader("Generate creative names for your startup, business, or project!")

# User inputs
keyword = st.text_input(
    "Enter a keyword:", help="Type a word to inspire your name (e.g., 'tech', 'food')."
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
    if keyword:
        # Construct the prompt
        prompt = {
            "keyword": keyword,
            "category": category,
            "count": count,
            "tone": tone,
        }

        # Call the model
        names = call_model(prompt)

        # Display the result
        st.markdown("### Generated Names:")
        for idx, name in enumerate(names, 1):
            # Remove any existing numbering or whitespace
            clean_name = name.lstrip("0123456789. ").strip()
            st.write(f"{idx}. {clean_name}")
    else:
        st.error("Please enter a keyword.")
