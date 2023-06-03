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

%:
	@true

.PHONY: default backend frontend
