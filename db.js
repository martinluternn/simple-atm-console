import fs from "fs";

const dataFilePath = "data.json";

export function readData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

export function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export function createItem(newItem) {
  const data = readItems();
  data.push(newItem);
  writeData(data);
}

export function readItems() {
  let data = readData();
  data = Array.isArray(data) ? data : [data]
  return data;
}

export function updateItem(index, updatedItem) {
  const data = readItems();
  if (index >= 0 && index < data.length) {
    data[index] = updatedItem;
    writeData(data);
  } else {
    throw new Error("Invalid index");
  }
}

export function deleteItem(index) {
  const data = readItems();
  if (index >= 0 && index < data.length) {
    writeData(data);
  } else {
    throw new Error("Invalid index");
  }
}
