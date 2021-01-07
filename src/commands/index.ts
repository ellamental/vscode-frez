import * as vscode from 'vscode'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


export interface ICommandsList {
    [name: string]: (...args:any) => void
}

export function registerCommands(context: vscode.ExtensionContext, ...commands: ICommandsList[]) {
    for (let commandList of commands) {
        for (let [name, command] of Object.entries(commandList)) {
            context.subscriptions.push(vscode.commands.registerCommand(`vscode-frez.${name}`, command))
        }
    }
}

/**
 * Execute a list of commands synchronously
 */
async function executeCommands(commands: string[]) {
    for (let command of commands) {
        await vscode.commands.executeCommand(command)

        // TODO(nick): Support commands with arguments (as an array with the
        //             command being the first argument)
        //
        // function isIterable (value) {
        //     return Symbol.iterator in Object(value);
        // }
        // if (isIterable(command)) {
        //     await vscode.commands.executeCommand(...command)
        // } else {
        //     await vscode.commands.executeCommand(command)
        // }
    }
}

/**
 * Execute a list of commands in parallel (but wait for the results).
 */
async function executeCommandsParallel(commands: string[]) {
    const promises = commands.map((command) => vscode.commands.executeCommand(command))
    for (const promise of promises) {
        await promise
    }
}

// ===================================================================================================================
// Misc Commands
// ===================================================================================================================

async function log() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    // const config = vscode.workspace.getConfiguration()
    // console.log('config: ', config)

    // const ret = await vscode.commands.executeCommand(
    //     'vscode.executeCodeActionProvider',
    //     editor.document.uri,
    //     editor.selection,
    // )

    // console.log('ret: ', ret)

    // logger.appendLine(`editor.selection.active.line: ${editor.selection.active.line}`)
    // logger.appendLine(`editor.selection.active.character: ${editor.selection.active.character}`)
    // logger.appendLine(`editor.selection.anchor.line: ${editor.selection.anchor.line}`)
    // logger.appendLine(`editor.selection.anchor.character: ${editor.selection.anchor.character}`)
    // logger.appendLine(`editor.selection.start.character: ${editor.selection.start.character}`)
    // logger.appendLine(`editor.selection.end.character: ${editor.selection.end.character}`)

    // const contextKeys = await vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    // logger.appendLine(`Context keys: ${contextKeys}`)

    // vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    // vscode.commands.executeCommand('workbench.action.toggleDevTools')

    logger.show()
}


export const commands: ICommandsList = {
    executeCommands,
    executeCommandsParallel,
    log,
}
