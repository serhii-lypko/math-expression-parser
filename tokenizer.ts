const { log } = console;

/*
  *** Lexical tokenization ***

  FIXME: cases:
  - 5.s + x (trets as valid expression)


  TODO:
  - functions (sin, cos etc)
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

enum OperatorAssoc {
  Left,
  Right,
}

var OperatorAssocMap = {
  "^": OperatorAssoc.Right,
  "*": OperatorAssoc.Left,
  "/": OperatorAssoc.Left,
  "+": OperatorAssoc.Left,
  "-": OperatorAssoc.Left,
};

const OperatorPrecMap = {
  "^": 4,
  "*": 3,
  "/": 3,
  "+": 2,
  "-": 2,
};

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  public static get operators(): Set<string> {
    return new Set(Object.keys(OperatorAssocMap));
  }

  public get isOperator(): boolean {
    return Token.operators.has(this.value);
  }

  get operatorAssoc(): OperatorAssoc {
    if (!this.isOperator) {
      throw new Error(`Given token ${this.value} is not an operator`);
    }

    return OperatorAssocMap[this.value];
  }

  get operatorPrec(): OperatorAssoc {
    if (!this.isOperator) {
      throw new Error(`Given token ${this.value} is not an operator`);
    }

    return OperatorPrecMap[this.value];
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

export class Tokenizer {
  input: string;
  tokens: Token[];
  cursor: number;

  constructor(input: string) {
    this.input = this.removeWhitespaces(input);
    this.tokens = [];
    this.cursor = 0;
  }

  public tokenize(): Token[] {
    if (this.input.length == 0) {
      return [];
    }

    while (this.cursor < this.input.length) {
      const char = this._currentSymbol;
      let token: Token;

      switch (true) {
        case this.isLetter(char):
          token = new Token(TokenType.Variable, char);
          this.cursor++;
          break;
        case this.isDigit(char):
          const value = this._collectDigitExpression();
          token = new Token(TokenType.Literal, value);
          break;
        case this.isOperator(char):
          token = new Token(TokenType.Operator, char);
          this.cursor++;
          break;
        case this.isComma(char):
          token = new Token(TokenType.Comma, char);
          this.cursor++;
          break;
        case this.isLeftParenthesis(char):
          token = new Token(TokenType.LeftParenthesis, char);
          this.cursor++;
          break;
        case this.isRightParenthesis(char):
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

    while ((this.isDigit(this._currentSymbol) || this.isDot(this._currentSymbol)) && this.cursor < this.input.length) {
      buffer.append(this._currentSymbol);
      this.cursor++;
    }

    return buffer.result;
  }

  get _currentSymbol() {
    return this.input[this.cursor];
  }

  private isLetter(char: string) {
    return /[a-z]/i.test(char);
  }

  private isDigit(char: string) {
    return /\d/.test(char);
  }

  private isOperator(char: string) {
    return /\+|-|\*|\/|\^/.test(char);
  }

  private isComma(char: string) {
    return char === ",";
  }

  private isDot(char: string) {
    return char === ".";
  }

  private isLeftParenthesis(char: string) {
    return /\(/.test(char);
  }

  private isRightParenthesis(char: string) {
    return /\)/.test(char);
  }

  private removeWhitespaces(input: string) {
    return input.replace(/\s+/g, "");
  }
}

export default Tokenizer;
