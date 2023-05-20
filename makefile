install:
	pipenv install --dev
	pipenv run pre-commit install -t pre-commit
	pipenv run pre-commit install -t pre-push

test:
	pipenv run pytest --cov --cov-fail-under=100

type:
	pipenv run mypy

format:
	pipenv run black
	pipenv run isort

style:
	pipenv run flake8

commit_skip:
	git commit --no-verify

push_skip:
	git push --no-verify

lint: format style type

bump:
	pipenv run cz bump

commit:
	pipenv run cz commit

push:
	git push -u origin

