# NameWiz - Creative Name Generator

🚀 **NameWiz** is a simple and fun Streamlit app to generate creative names for your startup, business, or project.

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

</details>

**2. Running the App**
To start the Streamlit app, run the following command:

  ```bash
  streamlit run app.py
  ```
