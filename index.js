#!/usr/bin/env node

// Hello! this is a command line tool to keep track of personal todos

// # v1.0.0 FEATURES
// - list todo items
// - add todo items
// - complete todo items
// - delete todo items

// Made by Dillon Schultz with Node.js + 🤍
// ----------------------------------------------------------------------------

const fs = require('fs');
const chalk = require('chalk');

const DATABASE_PATH = './.todo-data.json';

const initialize = () => {
	if (!fs.existsSync(DATABASE_PATH)) {
		console.log('Initializing...\nSetting up a `data.json` file');
		set([]);
	}
};

const get = () => {
	const rawData = fs.readFileSync(DATABASE_PATH);
	return JSON.parse(rawData);
};

const set = (data) => {
	fs.writeFileSync(DATABASE_PATH, JSON.stringify(data));
};

const command = process.argv[2];
const argument = process.argv[3];

// CRUD
const listTodos = () => {
	const data = get();
	if (data.length > 0) {
		console.log(chalk.white.bold.underline(`Your todo list:`));
		data.forEach((task, index) => {
			task.complete
				? console.log(
						chalk.green.strikethrough(`${index + 1} . [✓] - ${task.task}`)
				  )
				: console.log(chalk.white(`${index + 1} . [ ] - ${task.task}`));
		});
	} else {
		console.log(`You don't have any tasks added to your list`);
		console.log(chalk.inverse('If you need help type `todo help`.'));
	}
};

const addTodo = (taskName) => {
	const data = get();
	if (!argument) {
		console.log(
			chalk.yellow(`No task name given. Please check your last command.`)
		);
		console.log(chalk.inverse('If you need help type `todo help`.'));
	} else {
		data.push({
			task: taskName,
			complete: false,
			dateAdded: Date.now().toLocaleString(),
		});
		set(data);
		listTodos();
	}
};

const completeTodo = (taskNumber) => {
	const data = get();
	if (!argument) {
		console.log(
			chalk.yellow(
				`That task number doesn't exist. Please check your last command.`
			)
		);
		console.log(chalk.inverse('If you need help type `todo help`.'));
	} else {
		data[taskNumber].complete = !data[taskNumber].complete;
		set(data);
		listTodos();
	}
};

const deleteTodo = (taskNumber) => {
	const data = get();
	if (!argument) {
		console.log(
			chalk.yellow(
				`That task number doesn't exist. Please check your last command.`
			)
		);
		console.log(chalk.inverse('If you need help type `todo help`.'));
	} else {
		data.splice(taskNumber, taskNumber + 1);
		set(data);
		listTodos();
	}
};

const help = () => {
	console.log(
		`Commands:
    - list     | (takes no arguments)
    - add      | (takes a string as an argument)
    - complete | (takes a number as an argument)
    - delete   | (takes a number as an argument)
    - help     | (takes no arguments)`
	);
};

initialize();

switch (command) {
	case 'list':
		listTodos();
		break;
	case 'add':
		addTodo(argument);
		break;
	case 'complete':
		completeTodo(argument - 1);
		break;
	case 'delete':
		deleteTodo(argument - 1);
		break;
	case 'help':
		help();
		break;
	default:
		console.log(`Sorry, that command isn't valid`);
		help();
		break;
}
