// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-frez" is now active!');

	let disposable = vscode.commands.registerCommand('vscode-frez.scrollDownChunk', () => {
		vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line', value: 10})
		// Actually we just want to do a "center screen" here, not a scroll.
		vscode.commands.executeCommand('editorScroll', {to: 'down', by: 'line', value: 10})
	});
	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('vscode-frez.scrollUpChunk', () => {
		vscode.commands.executeCommand('cursorMove', {to: 'up', by: 'line', value: 10})
		vscode.commands.executeCommand('editorScroll', {to: 'up', by: 'line', value: 10})
	});

	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
