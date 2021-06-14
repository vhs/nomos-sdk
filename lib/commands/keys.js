function help() {
  return "keys list";
}

export default {
  help: help,
  exec: async (context) => {

    switch(context.args[0]) {
      case "list": return list(context);
      case "get": return get(context);
      case "delete": case "del": return del(context);
      default:
        help();
    }
  }
};

async function list(context) {

}

async function get(context) {

}

async function del(context) {

}
