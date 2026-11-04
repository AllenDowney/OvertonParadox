# Makefile for building and deploying the Jupyter Book (MyST) site

.PHONY: help build build-local clean deploy serve overtron

help:
	@echo "Available commands:"
	@echo "  make build    - Build the site (for GitHub Pages)"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make deploy   - Build and deploy to GitHub Pages"
	@echo "  make serve    - Build and serve locally"

build:
	BASE_URL=/OvertonParadox/ jupyter book build --html
	$(MAKE) overtron
	touch _build/html/.nojekyll

# The Overtron page (../overtron), built with vite and served at /OvertonParadox/overtron/.
# Needs the excerpt in ../overtron/public/data/v1 (python -m overton.excerpt; not in git).
overtron:
	test -f ../overtron/public/data/v1/respondents.bin.gz
	npm --prefix ../overtron run build
	rm -rf _build/html/overtron
	cp -r ../overtron/dist _build/html/overtron

build-local:
	jupyter book build --html

clean:
	rm -rf _build

deploy: build
	ghp-import -n -p -f _build/html

serve: build-local
	cd _build/html && python -m http.server 8000
