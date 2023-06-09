#!/usr/bin/env bash

# Install python if not installed
sudo apt-get install python3

# Install pipx
python3 -m pip install --user pipx
python3 -m pipx ensurepath

# Install pre-commit
pipx install pre-commit

# Setup pre-commit and pre-push hooks
pre-commit install -t pre-commit
pre-commit install -t pre-push