import Tokenizer from "./tokenizer.ts";
import Parser from "./parser.ts";

const { log, error } = console;

function main() {
  try {
    const tokenizer = new Tokenizer("5 + (3 - 1)");
    const tokenStream = tokenizer.tokenize();

    const parser = new Parser(tokenStream);
    const rpn = parser.rpn();
  } catch (err) {
    error(err);
  }
}

main();
