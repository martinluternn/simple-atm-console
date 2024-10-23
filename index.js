import inquirer from "inquirer";
import { readItems, updateItem } from "./db.js";
import {
  getActualBalance,
  getOwed,
  getTotalBalance,
  updatedUserWithNewBalance,
} from "./calculation.js";

let targetedUser;
let targetedUserIndex;
let existUser;
let userIndex;

async function runLogin() {
  await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Login",
      validate: (input) => {
        const allItems = readItems();
        userIndex = allItems.findIndex((el) => el.name === input.trim());
        existUser = allItems?.[userIndex];
        if (!existUser) {
          return "user is not exist";
        }
        return true;
      },
    },
  ]);
  console.log(`Hello, ${existUser.name}!`);
  console.log(`Your balance is: $${getActualBalance(existUser)}`);
  if (existUser.owedFrom) {
    existUser.owedFrom?.forEach((el) => {
      console.log(`Owed $${el.balance ?? 0} from ${el.name}`);
    });
  }
  runChoices();
}

async function runChoices() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "task",
      message: "What do you want to do?",
      choices: [
        { name: "deposit", value: "deposit" },
        { name: "withdraw", value: "withdraw" },
        { name: "transfer", value: "transfer" },
        new inquirer.Separator(),
        { name: "logout", value: "logout" },
      ],
    },
  ]);
  switch (answers.task) {
    case "deposit":
      runDeposit();
      break;
    case "withdraw":
      runWithdraw();
      break;
    case "transfer":
      runTransfer();
      break;
    case "logout":
      runLogout();
      break;
  }
}

async function runDeposit() {
  const answers = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Deposit [amount]",
      validate: (input) => {
        if (!input) return "please enter valid amount";
        return true;
      },
    },
  ]);
  existUser = updatedUserWithNewBalance(existUser, answers.amount, true);
  updateItem(userIndex, existUser);
  console.log(`Your balance is: $${getTotalBalance(existUser)}`);
  runChoices();
}

async function runWithdraw() {
  const answers = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Withdraw [amount]",
      validate: (input) => {
        if (!input) return "please enter valid amount";
        console.log("inii 1: ", Number(getActualBalance(existUser)));
        console.log("inii 2: ", Number(input));
        if (Number(getActualBalance(existUser)) < Number(input)) {
          return "your balance not sufficient";
        }
        return true;
      },
    },
  ]);
  existUser = updatedUserWithNewBalance(existUser, answers.amount, false);
  updateItem(userIndex, existUser);
  console.log(`Your balance is: $${getTotalBalance(existUser)}`);
  runChoices();
}

async function runTransfer() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "transferDetails",
      message: "Transfer [target] [amount]",
      validate: function (input) {
        const allItems = readItems();
        const parts = input.trim().split(" ");
        if (parts.length !== 2) {
          return "Please provide both target and amount separated by a space.";
        }
        const [target, amount] = parts;
        targetedUserIndex = allItems.findIndex(
          (el) => el.name === target.trim()
        );
        targetedUser = allItems[targetedUserIndex];
        if (!target || !targetedUser) {
          return "target doesn't exist";
        }

        if (targetedUser.name === existUser.name) {
          return "you can't transfer to yourself";
        }

        if (isNaN(amount) || Number(amount) <= 0) {
          return "please enter valid amount";
        }
        return true;
      },
    },
  ]);

  const [target, amount] = answers.transferDetails.split(" ");
  if (Number(getActualBalance(existUser)) >= Number(amount.trim())) {
    existUser = updatedUserWithNewBalance(existUser, amount.trim(), false);
    targetedUser = {
      ...targetedUser,
      balance: (targetedUser.balance ?? 0) + Number(amount.trim()),
    };
    updateItem(userIndex, existUser);
    updateItem(targetedUserIndex, targetedUser);
  } else {
    const newValue = getOwed(existUser, targetedUser, amount, true);
    const newExistUser = {
      ...existUser,
      balance: 0,
      owedFrom: newValue,
    };
    const newTargetedUser = {
      ...targetedUser,
      balance:
        (targetedUser.balance ?? 0) + Number(getActualBalance(existUser)),
      owedTo: getOwed(existUser, targetedUser, amount, true),
    };
    updateItem(userIndex, newExistUser);
    updateItem(targetedUserIndex, newTargetedUser);
    existUser = newExistUser;
    targetedUser = newTargetedUser;
  }
  console.log(`Transferred $${amount} to ${target}`);
  console.log(`Your balance is: $${getActualBalance(existUser)}`);
  runChoices();
}

async function runLogout() {
  console.log(`logout`);
  console.log(`Goodbye, ${existUser.name}`);
  existUser = undefined;
}

runLogin();
