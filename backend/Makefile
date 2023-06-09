#!/usr/bin/make -f

default:
	@echo "Please choose a target to build"

install:
	pipenv install --dev

dev:
	ENV=development pipenv run python manage.py runserver

run:
	ENV=production pipenv run python manage.py runserver

migrate:
	pipenv run python manage.py makemigrations
	pipenv run python manage.py migrate

test:
	pipenv run pytest -W ignore::DeprecationWarning

coverage:
	pipenv run pytest --cov=. --cov-report term --cov-report xml:docs/coverage.xml -W ignore::DeprecationWarning

black:
	pipenv run black .

isort:
	pipenv run isort --settings-path=setup.cfg .

flake8:
	pipenv run flake8 --config=setup.cfg .

lint: isort black flake8

uml:
	pipenv run python manage.py graph_models --dot -o docs/uml.dot
	dot -Tpng docs/uml.dot -o docs/uml.png

requirements:
	pipenv requirements > requirements.txt
	pipenv requirements --dev-only > requirements-dev.txt

audit:
	pipenv check --audit-and-monitor --save-json docs/audit.json

secrets:
	doppler secrets download --no-file --format env > .env

.PHONY: default install dev run migrate test coverage black isort flake8 lint uml requirements audit secrets

.EXPORT_ALL_VARIABLES:
PIPENV_VERBOSITY = -1
