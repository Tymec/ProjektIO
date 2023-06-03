#!/usr/bin/make -f

default:
	@echo "Please choose a target to build"

audit:
	pipenv check --audit-and-monitor --save-json audit.json

black:
	pipenv run black app/ users/

isort:
	pipenv run isort --settings-path=setup.cfg app/ users/

flake8:
	pipenv run flake8 --config=setup.cfg app/ users/

lint: isort black flake8

test:
	pipenv run python manage.py test

dev:
	ENV=development pipenv run python manage.py runserver

run:
	ENV=production pipenv run python manage.py runserver

migrate:
	pipenv run python manage.py makemigrations
	pipenv run python manage.py migrate

uml:
	pipenv run python manage.py graph_models --dot -o docs/uml.dot
	dot -Tpng docs/uml.dot -o docs/uml.png

requirements:
	pipenv requirements > requirements.txt
	pipenv requirements --dev-only > requirements-dev.txt

.PHONY: default audit black isort flake8 lint dev run migrate uml requirements

.EXPORT_ALL_VARIABLES:
PIPENV_VERBOSITY = -1
