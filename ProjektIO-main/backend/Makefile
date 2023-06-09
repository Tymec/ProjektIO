#!/usr/bin/make -f

default:
	@echo "Please choose a target to build"

### Sphinx
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = docs/
BUILDDIR      = docs/_build/

# use html
docs:
	pipenv run sphinx-build -M $(filter-out $@,$(MAKECMDGOALS)) "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

### Scripts
GENERATEDDIR = docs/_generated/

audit:
	pipenv check --audit-and-monitor --save-json $(GENERATEDDIR)/audit.json

black: 
	pipenv run black app/ users/ setup/ manage.py

isort: 
	pipenv run isort --settings-path=setup.cfg app/ users/ setup/ manage.py

flake8:
	pipenv run flake8 --config=setup.cfg app/ users/ setup/ manage.py

lint: isort black flake8

#dev:
#ENV=development pipenv run python manage.py runserver

run:
	ENV=production pipenv run python manage.py runserver

uml:
	pipenv run pyreverse -ASmy --source-roots app/ users/ -d $(GENERATEDDIR) app

migrate:
	pipenv run python manage.py makemigrations
	pipenv run python manage.py migrate

.PHONY: default docs audit black isort flake8 lint dev run uml migrate
