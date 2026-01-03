/**
 * @file Grammar for the Volo scripting language
 * @author Bastian Blokland <mail@bastian.tech>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "voloscript",

  extras: ($) => [/\s/, $.comment],
  word: ($) => $.identifier,

  rules: {
    source_file: ($) => $.block_implicit,

    comment: (_) => token(choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))),
    separator: (_) => choice(";", /\s+/),

    block_implicit: ($) => seq($.expression, repeat(seq($.separator, $.expression)), optional($.separator)),
    block_explicit: ($) => seq("{", $.block_implicit, "}"),

    expression_if: ($) =>
      prec.right(
        2,
        seq(
          "if",
          field("condition", $.expression_paren),
          field("consequence", $.expression),
          optional($.separator),
          optional(seq("else", field("alternative", $.expression))),
        ),
      ),

    expression_while: ($) =>
      seq("while", field("condition", $.expression_paren), field("consequence", $.expression)),

    expression_for_config: ($) =>
      seq(
        "(",
        optional(field("initializer", $.expression)),
        ";",
        optional(field("condition", $.expression)),
        ";",
        optional(field("increment", $.expression)),
        ")",
      ),

    expression_for: ($) => seq("for", $.expression_for_config, field("consequence", $.expression)),

    expression_paren: ($) => seq("(", $.expression, ")"),

    expression_var_declare: ($) =>
      seq("var", field("name", $.identifier), optional(seq("=", field("value", $.expression)))),

    expression_continue: (_) => "continue",
    expression_break: (_) => "break",
    expression_return: ($) => prec.right(seq("return", optional($.expression))),

    expression_call: ($) => seq(field("function", $.identifier), $.argument_list_paren),

    expression_modify: ($) =>
      seq(
        field("left", choice($.identifier, $.key)),
        choice("=", "+=", "-=", "*=", "/=", "%=", "??=", "|=", "&="),
        field("right", $.expression),
      ),

    expression_lookup: ($) => choice($.identifier, $.key, $.constant),

    expression_unary: ($) => prec.right(8, seq(choice("!", "-"), $.expression)),

    expression_primary: ($) =>
      choice(
        $.block_explicit,
        $.expression_paren,
        $.expression_if,
        $.expression_while,
        $.expression_for,
        $.expression_var_declare,
        $.expression_continue,
        $.expression_break,
        $.expression_return,
        $.expression_call,
        $.expression_modify,
        $.expression_lookup,
        $.expression_unary,
        $.number,
        $.string,
      ),

    expression_binary: ($) =>
      choice(
        prec.left(2, seq($.expression, "??", $.expression)),
        prec.left(3, seq($.expression, choice("||", "&&"), $.expression)),
        prec.left(4, seq($.expression, choice("==", "!="), $.expression)),
        prec.left(5, seq($.expression, choice("<", ">", "<=", ">="), $.expression)),
        prec.left(6, seq($.expression, choice("+", "-"), $.expression)),
        prec.left(7, seq($.expression, choice("*", "/", "%"), $.expression)),
      ),

    expression_select: ($) =>
      prec.right(
        1,
        seq(
          field("condition", $.expression),
          "?",
          field("consequence", $.expression),
          ":",
          field("alternative", $.expression),
        ),
      ),

    expression: ($) => choice($.expression_primary, $.expression_binary, $.expression_select),

    argument_list_paren: ($) => seq("(", optional($.argument_list), ")"),
    argument_list: ($) => seq($.expression, repeat(seq(",", $.expression))),

    identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    key: (_) => /\$[a-zA-Z_][a-zA-Z0-9_]*/,
    number: (_) => /\d+(\.\d+)?/,
    string: ($) => seq('"', repeat(/[^"\\]+/), token.immediate('"')),
    constant: (_) =>
      choice(
        "null",
        "true",
        "false",
        "pi",
        "deg_to_rad",
        "rag_to_deg",
        "up",
        "down",
        "left",
        "right",
        "forward",
        "backward",
        "quat_ident",
        "white",
        "black",
        "red",
        "green",
        "blue",
      ),
  },
});
