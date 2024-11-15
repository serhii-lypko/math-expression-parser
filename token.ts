export enum TokenType {
  Literal,
  Variable,
  Operator,
  Comma,
  LeftParenthesis,
  RightParenthesis,
}

export enum OperatorAssoc {
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

  public get isVariable(): boolean {
    return this.type === TokenType.Variable;
  }

  public get isLiteral(): boolean {
    return this.type === TokenType.Literal;
  }

  public get isOperator(): boolean {
    return this.type === TokenType.Operator;
  }

  public get isLeftParenthesis(): boolean {
    return this.type === TokenType.LeftParenthesis;
  }

  public get isRightParenthesis(): boolean {
    return this.type === TokenType.RightParenthesis;
  }

  public get isLeftAssoc(): boolean {
    return this.operatorAssoc == OperatorAssoc.Left;
  }

  public isRightAssoc(): boolean {
    return this.operatorAssoc == OperatorAssoc.Right;
  }

  public get operatorAssoc(): OperatorAssoc {
    if (!this.isOperator) {
      throw new Error(`Given token ${this.value} is not an operator when checking operatorAssoc`);
    }

    return OperatorAssocMap[this.value];
  }

  public get operatorPrec(): OperatorAssoc {
    if (!this.isOperator) {
      throw new Error(`Given token ${this.value} is not an operator when checking operatorPrec`);
    }

    return OperatorPrecMap[this.value];
  }
}

export default Token;
