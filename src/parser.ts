import Emitter from "./emitter.ts";
import Lexer from "./lexer.ts";
import Token, { TokenType } from "./token.ts";

export default class Parser {
  private currentToken: Token;
  private peekToken: Token;

  private symbols: Set<string> = new Set();
  private labels: Set<string> = new Set();
  private labelsGotoed: Set<string> = new Set();

  constructor(private lexer: Lexer, private emitter: Emitter) {
    this.lexer = lexer;
    this.emitter = emitter;

    this.currentToken = lexer.getToken();
    this.peekToken = lexer.getToken();
  }
  nextToken() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.getToken();
  }
  checkToken(tokenType: TokenType) {
    return this.currentToken.type === tokenType;
  }
  checkPeekToken(tokenType: TokenType) {
    return this.peekToken.type === tokenType;
  }
  matchToken(tokenType: TokenType) {
    if (this.checkToken(tokenType)) {
      this.nextToken();
    } else {
      throw new Error(
        `Unexpected token: ${this.currentToken.text} (${this.currentToken.type}), expected ${tokenType}`,
      );
    }
  }
  parse() {
    return this.parseProgram();
  }
  parseProgram() {
    this.emitter.headerLine("#include <stdio.h>");
    this.emitter.headerLine("int main(void) {");

    while (this.checkToken(TokenType.NEWLINE)) {
      this.nextToken();
    }

    while (!this.checkToken(TokenType.EOF)) {
      this.parseStatement();
    }

    this.emitter.emitLine("return 0;");
    this.emitter.emitLine("}");

    for (const label of this.labelsGotoed) {
      if (!this.labels.has(label)) {
        throw new Error(`Label ${label} not defined`);
      }
    }
  }
  parseStatement() {
    switch (this.currentToken.type) {
      case TokenType.PRINT:
        this.nextToken();
        if (this.checkToken(TokenType.STRING)) {
          this.emitter.emitLine('printf("' + this.currentToken.text + '\\n");');
          this.nextToken();
        } else {
          this.emitter.emit('printf("%' + '.2f\\n", (float)(');
          this.parseExpression();
          this.emitter.emitLine("));");
        }
        break;
      case TokenType.IF:
        this.nextToken();
        this.emitter.emit("if (");
        this.comparison();
        this.matchToken(TokenType.THEN);
        this.expectNl();
        this.emitter.emitLine(") {");
        while (!this.checkToken(TokenType.ENDIF)) {
          this.parseStatement();
        }
        this.matchToken(TokenType.ENDIF);
        this.emitter.emitLine("}");
        break;
      case TokenType.WHILE:
        this.nextToken();
        this.emitter.emit("while (");
        this.comparison();
        this.matchToken(TokenType.REPEAT);
        this.expectNl();
        this.emitter.emitLine(") {");
        while (!this.checkToken(TokenType.ENDWHILE)) {
          this.parseStatement();
        }
        this.matchToken(TokenType.ENDWHILE);
        this.emitter.emitLine("}");
        break;
      case TokenType.LABEL:
        this.nextToken();
        if (this.labels.has(this.currentToken.text)) {
          throw new Error(`Label ${this.currentToken.text} already defined`);
        } else {
          this.labels.add(this.currentToken.text);
        }
        this.emitter.emitLine(this.currentToken.text + ":");
        this.matchToken(TokenType.IDENT);
        break;
      case TokenType.GOTO:
        this.nextToken();
        this.labelsGotoed.add(this.currentToken.text);
        this.matchToken(TokenType.IDENT);
        break;
      case TokenType.LET:
        this.nextToken();
        if (!this.symbols.has(this.currentToken.text)) {
          this.symbols.add(this.currentToken.text);
          this.emitter.headerLine(`float ${this.currentToken.text};`);
        }
        this.emitter.emit(this.currentToken.text + " = ");
        this.matchToken(TokenType.IDENT);
        this.matchToken(TokenType.EQ);
        this.parseExpression();
        this.emitter.emitLine(";");
        break;
      case TokenType.INPUT:
        this.nextToken();
        if (!this.symbols.has(this.currentToken.text)) {
          this.symbols.add(this.currentToken.text);
          this.emitter.headerLine("float " + this.currentToken.text + ";");
        }
        this.emitter.emitLine(
          'if(0 == scanf("%' + 'f", &' + this.currentToken.text + ")) {",
        );
        this.emitter.emitLine(this.currentToken.text + " = 0;");
        this.emitter.emit('scanf("%');
        this.emitter.emitLine('*s");');
        this.emitter.emitLine("}");
        this.matchToken(TokenType.IDENT);
        break;
      default:
        throw new Error(
          `Unexpected token: ${this.currentToken.type} ${this.currentToken.text}`,
        );
    }

    this.expectNl();
  }
  expectNl() {
    while (this.checkToken(TokenType.NEWLINE)) {
      this.nextToken();
    }
  }
  parseExpression() {
    this.term();
    while (
      this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)
    ) {
      this.emitter.emit(this.currentToken.text);
      this.nextToken();
      this.term();
    }
  }
  comparison() {
    this.parseExpression();
    if (this.isComparisonOperator()) {
      this.emitter.emit(" " + this.currentToken.text + " ");
      this.nextToken();
      this.parseExpression();
    } else {
      throw new Error(
        `Unexpected token: ${this.currentToken.type} ${this.currentToken.text}, expected comparison operator`,
      );
    }
    while (this.isComparisonOperator()) {
      this.emitter.emit(" " + this.currentToken.text + " ");
      this.nextToken();
      this.parseExpression();
    }
  }
  term() {
    this.unary();
    while (
      this.checkToken(TokenType.ASTERISK) || this.checkToken(TokenType.SLASH)
    ) {
      this.emitter.emit(" " + this.currentToken.text + " ");
      this.nextToken();
      this.unary();
    }
  }
  unary() {
    if (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
      this.emitter.emit(this.currentToken.text);
      this.nextToken();
    }
    this.primary();
  }
  primary() {
    if (this.checkToken(TokenType.NUMBER)) {
      this.emitter.emit(this.currentToken.text);
      this.nextToken();
    } else if (this.checkToken(TokenType.IDENT)) {
      if (!this.symbols.has(this.currentToken.text)) {
        throw new Error(`Symbol ${this.currentToken.text} not defined`);
      }
      this.emitter.emit(this.currentToken.text);
      this.nextToken();
    } else {
      throw new Error(
        `Unexpected token: ${this.currentToken.type} ${this.currentToken.text}, expected number or ident`,
      );
    }
  }
  isComparisonOperator() {
    return this.checkToken(TokenType.EQ) || this.checkToken(TokenType.LT) ||
      this.checkToken(TokenType.GT) ||
      this.checkToken(TokenType.EQEQ) || this.checkToken(TokenType.LTEQ) ||
      this.checkToken(TokenType.GTEQ);
  }
}
