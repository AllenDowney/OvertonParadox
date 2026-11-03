# Makefile for building and deploying the Jupyter Book (MyST) site

.PHONY: help build build-local clean deploy serve

help:
	@echo "Available commands:"
	@echo "  make build    - Build the site (for GitHub Pages)"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make deploy   - Build and deploy to GitHub Pages"
	@echo "  make serve    - Build and serve locally"

build:
	BASE_URL=/OvertonParadox/ jupyter book build --html
	touch _build/html/.nojekyll

build-local:
	jupyter book build --html

clean:
	rm -rf _build

deploy: build
	ghp-import -n -p -f _build/html

serve: build-local
	cd _build/html && python -m http.server 8000
