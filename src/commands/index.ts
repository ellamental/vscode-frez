import * as vscode from 'vscode'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


const consoleLog = console.log.bind(console)
const consoleLogs: any[][] = []
console.log = function(...rest) {
    consoleLogs.push(Array.from(rest))
    consoleLog.apply(console, rest)
}


export interface CommandsListInterface {
    [name: string]: () => void
}


export function registerCommands(context: vscode.ExtensionContext, ...commands: CommandsListInterface[]) {
    for (let commandList of commands) {
        for (let [name, command] of Object.entries(commandList)) {
            context.subscriptions.push(vscode.commands.registerCommand(`vscode-frez.${name}`, command))
        }
    }
}


// ===================================================================================================================
// Misc Commands
// ===================================================================================================================


async function log() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    // logger.appendLine(`editor.selection.active.line: ${editor.selection.active.line}`)
    // logger.appendLine(`editor.selection.active.character: ${editor.selection.active.character}`)
    // logger.appendLine(`editor.selection.anchor.line: ${editor.selection.anchor.line}`)
    // logger.appendLine(`editor.selection.anchor.character: ${editor.selection.anchor.character}`)
    // logger.appendLine(`editor.selection.start.character: ${editor.selection.start.character}`)
    // logger.appendLine(`editor.selection.end.character: ${editor.selection.end.character}`)

    // const contextKeys = await vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    // logger.appendLine(`Context keys: ${contextKeys}`)

    // logger.show()

    vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    vscode.commands.executeCommand('workbench.action.toggleDevTools')
}


async function allContextKeys() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }


    const contextKeys = await vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    logger.appendLine(`Context keys: ${contextKeys}`)
    setTimeout(() => {
        logger.appendLine(`consoleLogs: ${consoleLogs}`)
        logger.show()
    }, 5000)
    // logger.show()
}


export const miscCommands: CommandsListInterface = {
    log,
    allContextKeys,
}
