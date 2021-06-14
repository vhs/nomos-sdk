import JSONFile from "./JSONFile.js";

export default class Session extends JSONFile {
  constructor(file = "~/.nomos/session") {
    super(file);

    this.username = this.username || undefined;
    this.userid = this.userid || 0;
    this.sessionid = this.sessionid || undefined;
  }
}
