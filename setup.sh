#!/usr/bin/env bash

# Install python if not installed
sudo apt-get install python3

# Install pipx
python3 -m pip install --user pipx
python3 -m pipx ensurepath

# Install pre-commit and commitizen
pipx install pre-commit commitizen

# Setup pre-commit and pre-push hooks
pre-commit install -t pre-commit
pre-commit install -t pre-push