import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollDownChunk', () => {
		// The naive method below doesn't respect the mark mode in emacs-mcx.
		// vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line', value: 10})
		// vscode.commands.executeCommand('editorScroll', {to: 'down', by: 'line', value: 10})

		let i
		for (i=0; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.nextLine')
		}
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
		// We should recenter after moving the cursor, but it makes the screen
		// jump around when you run these scroll-chunk commands at the
		// bottom/top of a file.
		//
		// Calling `emacs-mcx.recenterTopBottom` consecutively should do this,
		// however the `emacs-mcx.nextLine` calls should "interrupt" that
		// behavior and always result in the screen being scrolled so the cursor
		// is "centered".  I think this is likely a "bug" in
		// `emacs-mcx.recenterTopBottom`.
		//
		// vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")

		// vscode.commands.executeCommand('editorScroll', {to: 'down', by: 'line', value: 10})
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.scrollUpChunk', () => {
		// vscode.commands.executeCommand('cursorMove', {to: 'up', by: 'line', value: 10})
		let i
		for (i=0; i<10; i++) {
			vscode.commands.executeCommand('emacs-mcx.previousLine')
		}
		vscode.commands.executeCommand("emacs-mcx.recenterTopBottom")
		// vscode.commands.executeCommand('editorScroll', {to: 'up', by: 'line', value: 10})
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
