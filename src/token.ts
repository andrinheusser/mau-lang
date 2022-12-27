export enum TokenType {
  EOF = -1,
  NEWLINE = 0,
  NUMBER = 1,
  IDENT = 2,
  STRING = 3,
  // Keywords.
  LABEL = 101,
  GOTO = 102,
  PRINT = 103,
  INPUT = 104,
  LET = 105,
  IF = 106,
  THEN = 107,
  ENDIF = 108,
  WHILE = 109,
  REPEAT = 110,
  ENDWHILE = 111,
  // Operators.
  EQ = 201,
  PLUS = 202,
  MINUS = 203,
  ASTERISK = 204,
  SLASH = 205,
  EQEQ = 206,
  NOTEQ = 207,
  LT = 208,
  LTEQ = 209,
  GT = 210,
  GTEQ = 211,
}
const tokenTypeMap = new Map<string, TokenType>();
tokenTypeMap.set("+", TokenType.PLUS);
tokenTypeMap.set("-", TokenType.MINUS);
tokenTypeMap.set("*", TokenType.ASTERISK);
tokenTypeMap.set("/", TokenType.SLASH);
tokenTypeMap.set("=", TokenType.EQ);
tokenTypeMap.set("==", TokenType.EQEQ);
tokenTypeMap.set("!=", TokenType.NOTEQ);
tokenTypeMap.set("<", TokenType.LT);
tokenTypeMap.set("<=", TokenType.LTEQ);
tokenTypeMap.set(">", TokenType.GT);
tokenTypeMap.set(">=", TokenType.GTEQ);
tokenTypeMap.set("MIAU", TokenType.PRINT);
tokenTypeMap.set("MIAU?", TokenType.INPUT);
tokenTypeMap.set("MAU?", TokenType.IF);
tokenTypeMap.set("MAU!", TokenType.THEN);
tokenTypeMap.set("TSCHAUMAU", TokenType.ENDIF);
tokenTypeMap.set("MAUMAU?", TokenType.WHILE);
tokenTypeMap.set("MAUMAU!", TokenType.REPEAT);
tokenTypeMap.set("TSCHAUMAUMAU", TokenType.ENDWHILE);
tokenTypeMap.set("MAU", TokenType.LET);
tokenTypeMap.set("TSCHAU", TokenType.GOTO);
tokenTypeMap.set("MIAU!", TokenType.LABEL);

export default class Token {
  constructor(public type: TokenType, public text: string) {}
}
export { tokenTypeMap };
