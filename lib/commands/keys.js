import util from "util";

function help() {
  return `
  nomos keys list [options] -
    --userid ## - list for specific user, default current user
    --types a,b,c - filter key types. rfid, pin, api, github, slack, google
  nomos keys del {keyid} [options] - delete a specified key
     --approve - this parameter is required to actually delete, otherwise its only a dry run
  nomos keys generate [options] -
     --userid ## - user to create key for
     --type {type} - key type: rfid, pin, api, github, slack, google
     --key {key} - key value
     --notes "{notes}" - description of key
  nomos keys privileges {keyid} [options] -
     --privileges a,b,c - put list of privileges
  `;
}

export default {
  help: help,
  exec: async (context) => {

    switch(context.args[1]) {
      case "list": return list(context);
      case "get": return get(context);
      case "delete": case "del": return del(context);
      case "generate": return generate(context);
      case "privileges": return privileges(context);
      default:
        return context.commands.help.exec(context);
    }
  }
};

async function list(context) {
  const userid = context.param("--userid") || context.session.userid;
  const typesParam = context.param("--types");
  const types = typesParam ? typesParam.split(",").filter(v => !!v) : ["rfid","pin","api"];

  const { data: keys } = await context.api.KeyService1.GetUserKeys({ userid: userid, types: types });

  console.log(util.inspect(keys, { depth: null, colors: true }));
}

async function get(context) {
  const keyid = context.args[2];

  const { data: key } = await context.api.KeyService1.GetKey({ keyid: keyid });

  console.log(util.inspect(key, { depth: null, colors: true }));
}

async function del(context) {
  const keyid = context.args[2];
  const approved = context.args.includes("--approve");

  if (!approved) {
    console.log(`delete for keyid: ${keyid}`);
    console.log("you must --approve");
    return;
  }

  const { data } = await context.api.KeyService1.DeleteKey({ keyid: keyid });
  console.log(data);
}

async function generate(context) {
  const userid = context.param("--userid") || context.session.userid;
  const type = context.param("--type");
  const key = context.param("--key");
  const notes = context.param("--notes") || "";

  if (!type) {
    console.log("--type required.");
    return context.commands.help.exec(context);
  }

  if (!key) {
    console.log("--key required.");
    return context.commands.help.exec(context);
  }

  const { data } = await context.api.KeyService1.GenerateUserKey({ userid: userid, type: type, value: key, notes: notes });

  console.log(util.inspect(data, { depth: null, colors: true }));
}

async function privileges(context) {
  const keyid = context.args[2];
  const privilegesArg = context.param("--privileges");

  if (privilegesArg) {
    const privilegesList = privilegesArg.split(",").map(v => v.trim()).filter(v => !!v);

    const { statusCode, data } = await context.api.KeyService1.PutKeyPrivileges({ keyid: keyid, privileges: privilegesList });

    if (statusCode !== 200) {
      console.log(util.inspect(data, { depth: null, colors: true }));
      return;
    }
  }

  return get(context);
}
