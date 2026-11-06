# Build the paper: Markdown -> LaTeX (pandoc) -> PDF (latexmk), and the arXiv zip.
# Plan: docs/paper_plan.md.

BUILD = build
ARXIV = $(BUILD)/arxiv

.PHONY: all figures tex pdf arxiv clean

all: pdf

figures:
	mkdir -p figures
	grep -v '^#' figures.txt | grep . | while read f; do cp ../figs/$$f figures/; done

tex: figures
	mkdir -p $(BUILD)
	pandoc paper.md --template template.tex --natbib -o $(BUILD)/main.tex
	cp refs.bib $(BUILD)/
	rm -rf $(BUILD)/figures && cp -r figures $(BUILD)/

pdf: tex
	cd $(BUILD) && latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

# Source for arXiv: main.tex, the compiled bibliography (main.bbl), and figures.
# Rebuilt from scratch in $(ARXIV) to check it is self-contained, then zipped.
arxiv: pdf
	rm -rf $(ARXIV) $(BUILD)/arxiv.zip
	mkdir -p $(ARXIV)
	cp $(BUILD)/main.tex $(BUILD)/main.bbl $(ARXIV)/
	cp -r figures $(ARXIV)/
	cd $(ARXIV) && pdflatex -interaction=nonstopmode -halt-on-error main.tex >/dev/null && pdflatex -interaction=nonstopmode -halt-on-error main.tex >/dev/null
	rm -f $(ARXIV)/main.aux $(ARXIV)/main.log $(ARXIV)/main.out $(ARXIV)/main.pdf
	cd $(ARXIV) && zip -qr ../arxiv.zip .
	@echo "wrote $(BUILD)/arxiv.zip"; unzip -l $(BUILD)/arxiv.zip

clean:
	rm -rf $(BUILD) figures
