#!/usr/bin/make -f

default:
	@echo "Please choose a target to build"

run:
	ENV=production NODE_OPTIONS=--openssl-legacy-provider npm run start

dev:
	ENV=development NODE_OPTIONS=--openssl-legacy-provider npm run start

.PHONY: default eun dev
