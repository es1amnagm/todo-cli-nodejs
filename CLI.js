const fs = require("fs").promises;
const readLine = require("readline");
const filePath = "toDoApp.txt";

async function writeTask(tasks) {
  try {
    await fs.writeFile(filePath, JSON.stringify(tasks));
  } catch (error) {
    console.log("error " + error);
  }
}

async function getTasks() {
  try {
    let tasks = await fs.readFile(filePath, "utf-8");
    if (!tasks.trim()) {
      console.log("no tasks yet");
      return [];
    }
    return JSON.parse(tasks);
  } catch (error) {
    console.log("error " + error);
  }
}

async function addTask(name) {
  try {
    let tasks = await getTasks();
    let newTask = { id: Date.now(), name: name, done: false };
    tasks.push(newTask);
    await writeTask(tasks);
    console.log(`task number ${tasks.length} added successfully`);
  } catch (error) {
    console.log("error " + error);
  }
}
 
async function listTasks() {
  try {
    let tasks = await getTasks();
    if (tasks.length == 0) return console.log("no tasks");
    tasks.forEach((t, i) => {
      console.log(`${i + 1}. [${t.done ? "✔" : " "}] ${t.name}`);
    });
  } catch (error) {}
}

async function Done(index) {
  try {
    let tasks = await getTasks();
    if (tasks.indexOf(tasks[index - 1]) === -1)
      return console.log("no task has this index");
    tasks[index - 1].done = true;
    await writeTask(tasks);
    console.log("task became done");
  } catch (error) {
    console.log("error " + error);
  }
}

async function removeTask(index) {
  try {
    let tasks = await getTasks();
    if (tasks.indexOf(tasks[index - 1]) === -1)
      return console.log("no task has this index");
    tasks.splice(index - 1, 1);
    await writeTask(tasks);
    console.log(`task number ${index} removed successfully`);
  } catch (error) {
    console.log("error " + error);
  }
}

// static  (should add your command before running)
async function staticMain() {
  const [, , command, ...args] = process.argv;

  switch ((command || "").toLowerCase()) {
    case "add":
      await addTask(args.join(" "));
      break;
    case "list":
      await listTasks();
      break;
    case "remove":
      await removeTask(+args[0]);
      break;
    case "done":
      await Done(+args[0]);
      break;

    default:
      break;
  }
}

// dynamic (you can add your command any time you want)

async function dynamicMain() {
  const read = readLine.createInterface({
    input: process.stdin,
  });

  function printHelp() {
    console.log(
      `
Commands:
  add <task>          add a task (quotes keep spaces) e.g. add "Learn Node.js"
  list                show tasks
  done <num>          mark task number from 'list' as done
  remove <num>        remove task number from 'list'
  help                show this help
  exit                quit
    `.trim()
    );
  }

  read.setPrompt("todo> ");
  printHelp();
  read.prompt();

  read.on("line", async (line) => {
    const [command, ...args] = line.trim().split(" ");

    switch ((command || "").toLowerCase()) {
      case "add":
        await addTask(args.join(" "));
        break;
      case "list":
        await listTasks();
        break;
      case "remove":
        await removeTask(+args);
        break;
      case "done":
        await Done(+args);
        break;
      case "exit":
        read.close();
        break;
      default:
        console.log(`❓ Unknown command: ${command}. Type "help".`);
    }
  });
  read.prompt();

  read.on("close", () => {
    console.log("good by bro");
  });
  console.log("##########");
}
dynamicMain();
