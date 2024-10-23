import inquirer from "inquirer";
import { v4 as uuidv4 } from "uuid";
import { createItem, readItems } from "./db.js";

async function runRegister() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Register",
      validate: function (input) {
        const allItems = readItems();
        const selectedItem = allItems?.find((el) => el.name === input.trim());
        if (selectedItem) {
          return "User already exist";
        }
        return true;
      },
    },
  ]);
  console.log(`Hello, ${answers.name}!`);
  const data = {
    id: uuidv4(),
    name: answers.name,
  };
  createItem(data);

  console.log(`Register Success!`);
}

runRegister();
