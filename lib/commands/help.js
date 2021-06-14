
export default {
  exec: async (context) => {
    if (!context.commands[context.command]) {
      console.log(`${context.command} not found`);
      console.log(context.commands.help.help(context));
      return;
    }

    console.log(context.commands[context.command].help(context));
  },
  help: (context) => {
    return `
  nomos help - list all commands
  nomos help [command]
  commands:
    ${Object.keys(context.commands).join("\n    ")}
`;
  }
};
