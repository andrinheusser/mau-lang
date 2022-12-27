import Token, { tokenTypeMap } from "./token.ts";
import { TokenType } from "./token.ts";

export default class Lexer {
  private position = -1;
  private character = "";
  constructor(private input: string) {
    this.input = input + "\n";
  }

  nextCharacter() {
    this.position++;
    this.character = this.position < this.input.length
      ? this.input[this.position]
      : "\0";
  }
  peekNextCharacter() {
    return this.position + 1 < this.input.length
      ? this.input[this.position + 1]
      : "\0";
  }
  get currentCharacter() {
    return this.character;
  }

  getToken(): Token {
    this.nextCharacter();
    if (this.currentCharacter === "\0") {
      return new Token(TokenType.EOF, this.currentCharacter);
    }
    if (this.currentCharacter === "\n") {
      return new Token(TokenType.NEWLINE, this.currentCharacter);
    }
    if (
      this.currentCharacter === " " || this.currentCharacter === "\t" ||
      this.currentCharacter === "\r"
    ) {
      return this.getToken();
    }
    const tokenTypeKeys = [...tokenTypeMap.keys()].sort((a, b) =>
      b.length - a.length
    );
    for (
      const tokenType of tokenTypeKeys
    ) {
      const length = tokenType.length;
      if (length === 1) {
        if (this.currentCharacter === tokenType) {
          const token = new Token(
            tokenTypeMap.get(tokenType)!,
            this.currentCharacter,
          );
          this.nextCharacter();
          return token;
        }
      } else if (length === 2) {
        if (
          this.currentCharacter === tokenType[0] &&
          this.peekNextCharacter() === tokenType[1]
        ) {
          const token = new Token(
            tokenTypeMap.get(tokenType)!,
            this.currentCharacter + this.peekNextCharacter(),
          );
          this.nextCharacter();
          this.nextCharacter();
          return token;
        }
      }
    }

    if (this.currentCharacter === "#") {
      let next = "";
      while (next !== "\n") {
        this.nextCharacter();
        next = this.currentCharacter;
      }
      return this.getToken();
    }

    if (this.currentCharacter === '"') {
      let next = "";
      let text = "";
      while (next !== '"') {
        this.nextCharacter();
        next = this.currentCharacter;
        text += next;
      }
      text = text.slice(0, -1);
      return new Token(TokenType.STRING, text);
    }

    if (this.currentCharacter.match(/[0-9]/)) {
      let text = "";
      while (this.currentCharacter.match(/[0-9]/)) {
        text += this.currentCharacter;
        this.nextCharacter();
      }
      return new Token(TokenType.NUMBER, text);
    }

    if (this.currentCharacter.match(/[a-zA-Z]/)) {
      let text = "";
      while (this.currentCharacter.match(/[a-zA-Z\?\!]/)) {
        text += this.currentCharacter;
        this.nextCharacter();
      }
      if (
        tokenTypeKeys.map((k) => k.toUpperCase()).includes(text.toUpperCase())
      ) {
        return new Token(tokenTypeMap.get(text.toUpperCase())!, text);
      }

      return new Token(TokenType.IDENT, text);
    }

    throw new Error("Invalid character: " + this.currentCharacter);
  }
}
