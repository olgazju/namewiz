# NameWiz - Creative Name Generator

🚀 **NameWiz** is a simple and fun Streamlit app to generate creative names for your startup, business, or project.

Explore the live demo: [NameWiz](https://olgazju-namewiz-app-iwfyt2.streamlit.app/).

<img width="838" alt="image" src="https://github.com/user-attachments/assets/22db953b-8265-45a1-a302-33a29ea4c125" />

---

https://github.com/user-attachments/assets/5b5e1fec-9730-47ab-a7d6-a0a78081640c

---

## Requirements

- **Python 3.8 or above**
- **pyenv** installed on your system (check [pyenv installation guide](https://github.com/pyenv/pyenv#installation))
- **Streamlit** package
- Other required dependencies (listed in `requirements.txt`)

---

## Environment Setup

To get started with the NameWiz, you can either clone or fork the repository from GitHub. Use the following command to clone the repository:

```bash
git clone https://github.com/olgazju/namewiz.git
```

After cloning, navigate to the root folder of the project:

```bash
cd namewiz
```

**1. Local Environment Setup (macOS)**

<details>
  <summary>Click here to see Python environment setup</summary>

  #### Install `pyenv` and `pyenv-virtualenv`

  Make sure you have Homebrew installed, then run the following commands to install `pyenv` and `pyenv-virtualenv`:

  ```bash
  brew install pyenv
  brew install pyenv-virtualenv
  ```

  #### Install Python

  Use `pyenv` to install the desired version of Python. In this project, we are using Python 3.12.0:

  ```bash
  pyenv install 3.12.0
  ```

  #### Create a Virtual Environment

  Create a virtual environment named `namewiz` using `pyenv-virtualenv`:

  ```bash
  pyenv virtualenv 3.12.0 namewiz
  ```

  #### Connect the Virtual Environment to the Project Directory

  Set the local Python version to the virtual environment you just created:

  ```bash
  pyenv local namewiz
  ```
  #### Install the required dependencies

  ```bash
  pip install -r requirements.txt
  ```

  #### Install and configure pre-commit hooks

  ```bash
  pip install pre-commit
  pre-commit install
  ```

  #### Run pre-commit hooks manually (optional)

  ```bash
  pre-commit run --all-files
  ```

  #### Create a `.env` File

  To securely store environment variables, create a `.env` file in the root directory of the project. Add the following content to the `.env` file:

  ```plaintext
  GITHUB_TOKEN=your_github_token_here
  ```

  #### Obtain a GitHub Token

  To obtain a GitHub token, follow these steps:

  1. Go to [GitHub Settings](https://github.com/settings/tokens).
  2. Click on **Generate new token**.
  3. Select the scopes or permissions you need for your token.
  4. Click **Generate token**.
  5. Copy the generated token and paste it into your `.env` file as shown above.

  Make sure to keep your token secure and do not share it publicly.

</details>

**2. Running the App**
To start the Streamlit app, run the following command:

  ```bash
  streamlit run app.py
  ```

  ---

  ## Using NameWiz

  Once you have the app running, you can start generating creative names by configuring the following options:

1. **Enter Keywords**
   - Provide one or more keywords that represent your idea.
   - Keywords can be separated by any non-alphanumeric symbol (e.g., `table,fashion|cats`).

2. **Select a Category**
   - Choose a category that best fits your idea (e.g., Tech Startup, Food, Travel).
   - Categories help refine the generated names to match your theme.

3. **Number of Names**
   - Use the slider to specify how many names you want to generate (1–10).

4. **Select a Tone**
   - Pick a tone for the names, such as:
     - Professional
     - Fun/Playful
     - Modern/Minimalist
     - Luxury/High-End

5. **Choose a Language**
   - Select from popular languages, such as English, Spanish, French, or others.
   - The app will generate names in the chosen language.

6. **Generate Names**
   - Click the **Generate Names** button to see the results.
   - The app will display a list of creative names based on your inputs.

Enjoy exploring unique and tailored names for your project or business!
