#!/usr/bin/env node

import createContext from "../lib/context.js";

export const context = createContext();

(async () => {
  if (!context.commands[context.command]) {
    await context.commands.help.exec(context);
    process.exit();
  }

  await context.commands[context.command].exec(context);
  await context.config.save();
})();
