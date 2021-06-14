export default {
  exec: login,
  help: help
};
function help() {
  return `
  nomos login [username]
  `;
}

async function login(context) {
  let username = context.args[1];

  if (!username) {
    username = await context.rl.question("username: ");
  } else {
    console.log("username:", username);
  }

  const password = await context.rl.question("password: ", true);

  const { statusCode, headers, data: user } = await context.api.AuthService1.CurrentUser(undefined, {
    auth: `${username}:${password}`
  });

  if (statusCode !== 200) {
    throw new Error("login failed");
  }

  if (headers["set-cookie"]) {
    const sessionid = headers["set-cookie"].find((v) => v.startsWith("PHPSESSID=")).split(";")[0].split("=")[1];

    context.session.username = username;
    context.session.userid = user.id;
    context.session.sessionid = sessionid;
    context.session.save();
  }

  console.log(headers, user);
}
