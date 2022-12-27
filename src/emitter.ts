export default class Emitter {
  constructor(
    private filename: string,
    private header = "",
    private code = "",
  ) {}
  emit(code: string) {
    this.code += code;
  }
  emitLine(code: string) {
    this.code += code + "\n";
  }
  headerLine(code: string) {
    this.header += code + "\n";
  }
  writeFile() {
    console.log("Writing to file: ", this.filename);
    Deno.writeTextFileSync(this.filename, this.header + this.code);
  }
}
