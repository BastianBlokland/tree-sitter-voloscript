default: build

# ---------------------------------------------------------
# Utilities.
# ---------------------------------------------------------

.PHONY: generate
generate:
	tree-sitter generate

.PHONY: build
build: generate
	tree-sitter build

.PHONY: test
test: build
	tree-sitter test

.SILENT:
