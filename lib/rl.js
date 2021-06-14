import util from "util";
import readline from "readline";

export default function rl() {
  return {
    question: async (message, $private = false) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      if ($private) {
        rl.input.on("keypress", function (c, k) {
          // get the number of characters entered so far:
          const len = rl.line.length;
          // move cursor back to the beginning of the input:
          readline.moveCursor(rl.output, -len, 0);
          // clear everything to the right of the cursor:
          readline.clearLine(rl.output, 1);
          // replace the original input with asterisks:
          for (let i = 0; i < len; i++) {
            rl.output.write("*");
          }
        });
      }

      return new Promise((resolve, reject) => {
        try {
          rl.question(message, (answer) => {
            resolve(answer);
            rl.close();
          });
        } catch(e) {
          reject(e);
        }
      });
    }
  };
}