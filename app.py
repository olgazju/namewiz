import streamlit as st


# Mock model call function
def call_model(prompt):
    # Simulate a response from the model
    mocked_response = {
        "prompt": prompt,
        "results": [
            f"Amazing {prompt['keyword']} Ventures",
            f"Brilliant {prompt['keyword']} Concepts",
            f"Creative {prompt['keyword']} Labs",
        ],
    }
    return mocked_response


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

        # Mock model call
        response = call_model(prompt)

        # Display the prompt (dumped for debugging)
        st.markdown("### Prompt Sent to Model:")
        st.json(prompt)

        # Display the mocked result
        st.markdown("### Mocked Model Response:")
        st.json(response)
    else:
        st.error("Please enter a keyword.")
