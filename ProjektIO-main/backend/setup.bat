@echo off

:: Set CI environment variable
if "%CI%" == "" set CI=false

:: Install pyenv
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"

:: Install Python 3.10
pyenv install 3.10

:: Install pipx
python -m pip install --user pipx
python -m pipx ensurepath

:: Install pipenv
pipx install pipenv

:: Install dependencies
if "%CI%" == "true" pipenv install --deploy --dev
else pipenv install --dev
winget install graphviz

:: Install plantuml
if not exist "docs\utils" mkdir docs\utils
powershell -Command "& {Invoke-WebRequest -Uri 'http://sourceforge.net/projects/plantuml/files/plantuml.jar/download' -OutFile 'docs\utils\plantuml.jar'}"

:: Setup pre-commit and pre-push hooks
pipenv run pre-commit install -t pre-commit
pipenv run pre-commit install -t pre-push

:: Enter pipenv shell
pipenv shell
