#!/usr/bin/make -f

default:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  commit"
	@echo "  backend [command]"
	@echo "  frontend [command]"

backend:
	$(MAKE) -C backend $(filter-out $@,$(MAKECMDGOALS))

frontend:
	$(MAKE) -C frontend $(filter-out $@,$(MAKECMDGOALS))

commit:
	export PIPENV_PIPFILE=$(PWD)/backend/Pipfile
	bash .git/hooks/pre-commit
	pipenv run cz commit

push:
	git push -u origin main

.PHONY: default setup backend frontend commit push
