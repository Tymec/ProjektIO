#!/usr/bin/env bash

# set environment variable if not set
if [ -z "$CI" ]; then
  export CI=false
fi

# Install packages
sudo apt-get install python3 python3-venv graphviz

# Install pyenv
curl https://pyenv.run | bash

# Install pythone 3.10
pyenv install 3.10

# Install pipx
python3 -m pip install --user pipx
python3 -m pipx ensurepath

# Install pipenv
pipx install pipenv

# Install dependencies
if [ "$CI" = true ]; then
  pipenv install --deploy --dev
else
  pipenv install --dev
fi

# Install plantuml
mkdir -p docs/utils
curl -L -o docs/utils/plantuml.jar http://sourceforge.net/projects/plantuml/files/plantuml.jar/download

# Setup pre-commit and pre-push hooks
pipenv run pre-commit install -t pre-commit
pipenv run pre-commit install -t pre-push

# Enter pipenv shell
pipenv shell
