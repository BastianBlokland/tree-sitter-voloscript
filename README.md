# tree-sitter-voloscript

Tree-sitter grammar for the Volo scripting language (used in the [Volo](https://github.com/bastianblokland/volo) RTS game)

## Building

Generate the tree-sitter parser source: `tree-sitter generate`.
Compile the `voloscript.so` parser library: `tree-sitter build`.

## Testing

Visualize the parse tree: `tree-sitter parse myScript.script`.
Visualize the highlighting: `tree-sitter highlight myScript.script`.
