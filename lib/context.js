import Config from "./Config.js";
import Session from "./Session.js";
import commands from "./commands/index.js";
import API from "./Api.js";
import rl from "./rl.js";
import log from "./log.js";

export default function createContext() {
  const config = new Config();
  const session = new Session();

  const command = process.argv[2];
  const args = process.argv.slice(2);

  const context = {
    config: config,
    session: session,
    commands: commands,
    command: command,
    args: args,
    param: (key) => {
      let index = args.indexOf(key);
      if (index >= 0 && index + 1 < args.length) {
        return args[index + 1];
      }

      return undefined;
    }
  };

  context.log = log(context);
  context.api = new API(context);
  context.rl = rl(context);

  return context;
}
