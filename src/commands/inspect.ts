import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


function inspectContextKeys() {
    // Unfortunately this is just a `console.log` and doesn't return the
    // keys/values. See:
    // https://github.com/microsoft/vscode/blob/15561c41399e5da051f8bde8107d29a9dc909b9c/src/vs/workbench/browser/actions/developerActions.ts#L85
    //
    // This means that we can't easily grab these and inject them into a
    // completion provider at runtime, or even easily copy them and write them
    // to a file for a static provider (like )
    vscode.commands.executeCommand('workbench.action.inspectContextKeys')
    vscode.commands.executeCommand('workbench.action.toggleDevTools')
}

async function inspectCommands() {
    const allCommands = await vscode.commands.getCommands()
    allCommands.sort()
    for (let command of allCommands) {
        logger.appendLine(command)
    }
    logger.show()
}


export const commands: ICommandsList = {
    inspectContextKeys,
    inspectCommands,
}
