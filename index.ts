const { log } = console;

/*
  // TODO:
  - negative cases
  - invalid cases with variables: 55.3 + ax <- it is not a function;
  - test runs
*/

enum TokenType {
  Literal,
  Variable,
  Operator,
  Comma,
  LeftParenthesis,
  RightParenthesis,
}

class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
}

enum BufferKind {
  Decimal,
  Letter,
}

class Buffer {
  kind: BufferKind;
  buffer: string[];

  constructor(kind: BufferKind) {
    this.kind = kind;
    this.buffer = [];
  }

  append(value: string) {
    if (this._isDecimal) {
      const isValid = this._isValid([...this.buffer, value]);

      if (!isValid) {
        throw new Error(`Attempting to append invalid char ${value} to decimal buffer`);
      }
    }

    this.buffer.push(value);
  }

  public get result(): string {
    return this.buffer.join("");
  }

  _isValid(bufferPredicate: string[]): boolean {
    const value = bufferPredicate.join("");
    const startsFromDot = value.startsWith(".");
    const containsSeveralDots = (value.match(/\./g) || []).length > 1;

    if (startsFromDot || containsSeveralDots) {
      return false;
    }

    return true;
  }

  get _isDecimal() {
    return this.kind === BufferKind.Decimal;
  }
}

class Tokenizer {
  input: string;
  tokens: Token[];
  cursor: number;

  constructor(input: string) {
    this.input = this._removeWhitespaces(input);
    this.tokens = [];
    this.cursor = 0;
  }

  tokenize(): Token[] {
    if (this.input.length == 0) {
      return [];
    }

    while (this.cursor < this.input.length) {
      const char = this._currentSymbol;
      let token: Token;

      switch (true) {
        case this._isLetter(char):
          token = new Token(TokenType.Variable, char);
          this.cursor++;
          break;
        case this._isDigit(char):
          const value = this._collectDigitExpression();
          token = new Token(TokenType.Literal, value);
          break;
        case this._isOperator(char):
          token = new Token(TokenType.Operator, char);
          this.cursor++;
          break;
        case this._isComma(char):
          token = new Token(TokenType.Comma, char);
          this.cursor++;
          break;
        case this._isLeftParenthesis(char):
          token = new Token(TokenType.LeftParenthesis, char);
          this.cursor++;
          break;
        case this._isRightParenthesis(char):
          token = new Token(TokenType.RightParenthesis, char);
          this.cursor++;
          break;

        default:
          throw new Error("Unexpected character while parsing");
      }

      this.tokens.push(token);
    }

    return this.tokens;
  }

  _collectDigitExpression(): string {
    const buffer = new Buffer(BufferKind.Decimal);

    while (
      (this._isDigit(this._currentSymbol) || this._isDot(this._currentSymbol)) &&
      this.cursor < this.input.length
    ) {
      buffer.append(this._currentSymbol);
      this.cursor++;
    }

    return buffer.result;
  }

  get _currentSymbol() {
    return this.input[this.cursor];
  }

  _isLetter(char: string) {
    return /[a-z]/i.test(char);
  }

  _isDigit(char: string) {
    return /\d/.test(char);
  }

  _isOperator(char: string) {
    return /\+|-|\*|\/|\^/.test(char);
  }

  _isComma(char: string) {
    return char === ",";
  }

  _isDot(char: string) {
    return char === ".";
  }

  _isLeftParenthesis(char: string) {
    return /\(/.test(char);
  }

  _isRightParenthesis(char: string) {
    return /\)/.test(char);
  }

  _removeWhitespaces(input: string) {
    return input.replace(/\s+/g, "");
  }
}

function main() {
  // const tokenizer = new Tokenizer("432 + 5");
  const tokenizer = new Tokenizer("(432.3 + 5) * x - 32.572");
  // const tokenizer = new Tokenizer("5 + 7 + 3");

  const res = tokenizer.tokenize();
  log(res);
}

main();
