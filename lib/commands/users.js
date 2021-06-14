import util from "util";

export default {
  exec: users,
  help: help
};

function help(context) {
  return `
  nomos users - current user
  nomos users [sub command]
    nomos users current - current user
    nomos users get [userid] - details for user
    nomos users list {search} [options] - list all users
      --page {index} - page index, default 1
      --size {size} - result page size, default 5
      --columns - default id,username,fname,lname,email,privileges,created,mem_expire,active,cash,lastlogin
      --sort "column order" - default "created desc"
    nomos users find {search} [options] - search users
      --page {index} - page index, default 1
      --size {size} - result page size, default 5
      --columns - default id,username,fname,lname,email,privileges,created,mem_expire,active,cash,lastlogin
      --sort "column order" - default "created desc"
    nomos users add - create a user
    nomos users del [userid] - delete a user
  `;
}

async function users(context) {
  switch(context.args[1]) {
    case "current": return current(context);
    case "get": return get(context);
    case "list": case "find": return list(context);
    default:
      return context.commands.help.exec(context);
  }
}

async function current(context) {
  const { data: user } = await context.api.AuthService1.CurrentUser();
  console.log(util.inspect(user, { depth: null, colors: true }));
}

async function get(context) {
  const { data: user } = await context.api.UserService1.GetUser({ userid: Number.parseInt(context.args[2]) });
  console.log(util.inspect(user, { depth: null, colors: true }));
}

async function list(context) {
  const search = context.args[2];
  const term = `%${search}%`;
  const page = context.param("--page") || 0;
  const size = context.param("--size") || 5;
  const sort = context.param("--sort") || "created";
  const columns = (context.param("--columns") || "id,create,username,fname,lname,email"); //.split(",").map(v => v.trim()).filter(v => !!v);

  const filters = search ? {
    left: {
      column: "username",
      operator: "like",
      value: term
    },
    operator: "or",
    right: {
      left: {
        column: "email",
        operator: "like",
        value: term
      },
      operator: "or",
      right: {
        left: {
          column: "fname",
          operator: "like",
          value: term
        },
        operator: "or",
        right: {
          column: "lname",
          operator: "like",
          value: term
        }
      }
    }
  } : null;

  const { data: users } = await context.api.UserService1.ListUsers({ page: Number.parseInt(page), size: Number.parseInt(size), columns: columns, order: sort, filters: filters })

  console.log(columns);
  console.log(util.inspect(users, { depth: null, colors: true }));
}
