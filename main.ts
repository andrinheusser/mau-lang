import Lexer from "./src/lexer.ts";
import Parser from "./src/parser.ts";
import Emitter from "./src/emitter.ts";

const sourceFile = Deno.args[0];

if (!sourceFile) throw new Error("No source file provided");

const source = Deno.readTextFileSync(sourceFile);

const lexer = new Lexer(
  source,
);
const emitter = new Emitter(sourceFile.split(".")[0] + ".c");
const parser = new Parser(lexer, emitter);

parser.parseProgram();
emitter.writeFile();
