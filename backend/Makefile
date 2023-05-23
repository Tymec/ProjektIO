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

coverage:
	pipenv run pytest --cov=app --cov-report term --cov-report xml:coverage.xml

test:
	pipenv run pytest

mypy:
	pipenv run mypy --config-file=setup.cfg app/

black: 
	pipenv run black app/
	pipenv run black tests/

isort: 
	pipenv run isort --settings-path=setup.cfg app/ tests/

flake8:
	pipenv run flake8 --config=setup.cfg app/ tests/

lint: isort black flake8 mypy

dev:
	ENV=development pipenv run python -m app

run:
	ENV=production pipenv run python -m app

uml:
	pipenv run pyreverse -ASmy --source-roots app/ -d $(GENERATEDDIR) app

.PHONY: default docs audit test mypy black isort flake8 lint dev run uml
