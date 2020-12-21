import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const chunkSize: number = 10

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollDownChunk', () => {
		// The naive method below doesn't respect the mark mode in emacs-mcx.
		// vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line', value: 10})
		// vscode.commands.executeCommand('editorScroll', {to: 'down', by: 'line', value: 10})

		let i: number
		for (i=chunkSize; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.nextLine')
		}

		// This doesn't actually "center" the cursor, but it does make the
		// screen scroll without (visually) moving the cursor.
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollUpChunk', () => {
		let i: number
		for (i=chunkSize; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.previousLine')
		}
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollUpChunkMultiple', () => {
		let i: number
		for (i=chunkSize*5; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.nextLine')
		}
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollDownChunkMultiple', () => {
		let i: number
		for (i=chunkSize*5; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.previousLine')
		}
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
	}));



}

// this method is called when your extension is deactivated
export function deactivate() {}
