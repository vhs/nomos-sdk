import fs from "fs";
import path from "path";

export default class JSONFile {
  constructor(file) {
    this.$file = path.normalize(file.replace("~", process.env.HOME));

    this.load();
  }

  load() {
    const dir = path.dirname(this.$file);

    if (!fs.statSync(dir, { throwIfNoEntry: false })) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.statSync(this.$file, { throwIfNoEntry: false })) {
      return;
    }

    try {
      const c = JSON.parse(fs.readFileSync(this.$file, { encoding: "utf8" }));

      for (const key of Object.keys(c)) {
        if (key.startsWith("$")) {
          continue;
        }

        this[key] = c[key];
      }
    } catch (e) {
      console.error(`Failed loading: ${this.$file}`, e);
    }
  }

  toString() {
    return JSON.stringify({
      ...Object.keys(this).reduce((acc, k) => {
        if (k.startsWith("$")) {
          return acc;
        }

        acc[k] = this[k];

        return acc;
      }, {})
    }, undefined, 2);
  }

  save() {
    fs.writeFileSync(this.$file, this.toString(), { encoding: "utf8" });
  }
}
