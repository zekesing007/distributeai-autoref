const { prompt, logMessage, rl } = require("./utils/logger");
const distributeAI = require("./class/distribute");
const { getRandomProxy, loadProxies } = require("./class/proxy");
const chalk = require("chalk");
const fs = require("fs");

async function main() {
  console.log(
    chalk.cyan(`
░█▀▄░▀█▀░█▀▀░▀█▀░█▀▄░▀█▀░█▀▄░█░█░▀█▀░█▀▀
░█░█░░█░░▀▀█░░█░░█▀▄░░█░░█▀▄░█░█░░█░░█▀▀
░▀▀░░▀▀▀░▀▀▀░░▀░░▀░▀░▀▀▀░▀▀░░▀▀▀░░▀░░▀▀▀
 ██████╗██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗ ██╗  ██╗ ██████╗ ███╗   ███╗
██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔═══██╗██║ ██╔╝██╔═══██╗████╗ ████║
██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║   ██║█████╔╝ ██║   ██║██╔████╔██║
██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║   ██║██╔═██╗ ██║   ██║██║╚██╔╝██║
╚██████╗██║  ██║   ██║   ██║        ██║   ╚██████╔╝██║  ██╗╚██████╔╝██║ ╚═╝ ██║
 ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝     
    https://t.me/cryptokom2
  `)
  );

  const refCode = await prompt(chalk.yellow("Enter Referral Code: "));
  const count = parseInt(await prompt(chalk.yellow("How many do you want? ")));
  const proxiesLoaded = loadProxies();
  if (!proxiesLoaded) {
    logMessage(null, null, "No Proxy. Using default IP", "warning");
  }
  const accountDistribute = fs.createWriteStream("accounts.txt", {
    flags: "a",
  });
  let successful = 0;
  let attempt = 1;

  try {
    while (successful < count) {
      console.log(chalk.white("-".repeat(85)));
      const currentProxy = await getRandomProxy(successful + 1, count);
      const distri = new distributeAI(
        refCode,
        currentProxy,
        successful + 1,
        count
      );
      try {
        const account = await distri.singleProses();

        if (account) {
          accountDistribute.write(`Email: ${account.registration.email}\n`);
          accountDistribute.write(
            `Password: ${account.registration.password}\n`
          );
          accountDistribute.write("-".repeat(85) + "\n");
          successful++;
          logMessage(
            successful,
            count,
            `Email : ${account.registration.email}`,
            "success"
          );
          logMessage(successful, count, `Reff To : ${refCode}`, "success");
          attempt = 1;
        } else {
          logMessage(
            successful + 1,
            count,
            "Register Account Failed, retrying...",
            "error"
          );
          attempt++;
        }
      } catch (error) {
        logMessage(
          successful + 1,
          count,
          `Error: ${error.message}, retrying...`,
          "error"
        );
        attempt++;
      }
    }
  } finally {
    accountDistribute.end();
    console.log(chalk.magenta("\n[*] Dono bang!"));
    console.log(
      chalk.green(`[*] Account dono ${successful} dari ${count} akun`)
    );
    console.log(chalk.magenta("[*] Result in accounts.txt"));
    rl.close();
  }
}

main();
