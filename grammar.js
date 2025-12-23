/**
 * @file Grammar for the Volo scripting language
 * @author Bastian Blokland <mail@bastian.tech>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "voloscript",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
