import JSONFile from "./JSONFile.js";

export default class Config extends JSONFile {
  constructor(file = "~/.nomos/config") {
    super(file);

    this.baseUrl = this.baseUrl || "https://membership.vanhack.ca";
    this.servicesPath = this.servicesPath || "/services/web";
    this.logLevel = this.logLevel || "info";
  }
}
