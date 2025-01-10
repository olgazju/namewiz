import streamlit as st
import random

# Predefined options for name generation
adjectives = ["Amazing", "Brilliant", "Creative", "Dynamic", "Epic", "Genius", "NextGen", "Legendary", "Bold", "Visionary"]
nouns = ["Solutions", "Ventures", "Creations", "Concepts", "Designs", "Labs", "Studios", "Technologies", "Ideas", "Works"]
suffixes = ["Inc", "LLC", "Co", "Group", "Corp", "Worldwide", "Global", "Systems"]
themes = {
    "Tech": ["Innovations", "AI", "Robotics", "Data", "Networks"],
    "Fashion": ["Style", "Threads", "Wear", "Couture", "Vibes"],
    "Food": ["Eats", "Deli", "Bites", "Kitchen", "Flavors"]
}

# Function to generate a list of random names
def generate_names(keyword, category, count=5):
    selected_nouns = themes.get(category, nouns)
    generated_names = []
    for _ in range(count):
        adj = random.choice(adjectives)
        noun = random.choice(selected_nouns)
        suffix = random.choice(suffixes)
        name = f"{adj} {keyword.capitalize()} {noun} {suffix}"
        generated_names.append(name)
    return generated_names

# Streamlit app
st.title("🚀 NameWiz")
st.subheader("Generate unique names for your startup, business, or project!")

# User input
keyword = st.text_input("Enter a keyword:", help="Type a word to inspire your name (e.g., 'tech', 'food').")
category = st.selectbox("Select a category:", ["General"] + list(themes.keys()))
count = st.number_input("Number of names to generate:", min_value=1, max_value=10, value=5, step=1)

# Generate names
if st.button("Generate Names"):
    if keyword:
        names = generate_names(keyword, category if category != "General" else None, count)
        st.subheader("🌟 Generated Names:")
        for idx, name in enumerate(names, 1):
            st.write(f"{idx}. {name}")
    else:
        st.error("Please enter a keyword.")

# Footer
st.markdown("💡 Tip: Use creative keywords to get the best results!")
