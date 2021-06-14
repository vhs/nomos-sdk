export default {
  exec: user,
  help: help
};

function help(context) {
  return `
  nomos user - current user
  nomos user [sub command]
    nomos user current - current user
    nomos user get [userid] - details for user
    nomos user list - list all users
    nomos user find [search] - search users
    nomos user add - create a user
    nomos user del [userid] - delete a user
  `;
}

async function user(context) {
  if (context.args[1] === "current") {
    const { data: user } = await context.api.AuthService1.CurrentUser();
    console.log(user);
    return;
  }

  if (context.args[1] === "get") {
    const { data: user } = await context.api.UserService1.GetUser({ userid: Number.parseInt(context.args[2]) });
    console.log(user);
    return;
  }

  help(context);
}
