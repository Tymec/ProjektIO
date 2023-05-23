@echo off

:: Install pyenv
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"

:: Install Python 3.10
pyenv install 3.10

:: Install pipx
python -m pip install --user pipx
python -m pipx ensurepath

:: Install pre-commit and commitizen
pipx install pre-commit commitizen

:: Setup pre-commit and pre-push hooks
pipx run pre-commit install -t pre-commit
pipx run pre-commit install -t pre-push
