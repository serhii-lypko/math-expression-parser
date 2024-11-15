import Lexer from "./lexer.ts";
import Parser from "./parser.ts";

const { log, error } = console;

// TODO: implement parsing with generators?

function main() {
  try {
    // const input = '5 + (3 - 1)';
    // const input = "5 + 3 * 8 - 4";
    // const input = "A + B * C - D";
    const input = "5 + (3 - 7) * 10";
    // const input = "(5 + 5)";

    // 3 + 4 × (2 − 1)

    const tokenizer = new Lexer(input);
    const tokenStream = tokenizer.tokenize();

    const parser = new Parser(tokenStream);
    const rpn = parser.rpn();

    // TODO: evaluator (for non-algebraic expressions)
  } catch (err) {
    error(err);
  }
}

main();
