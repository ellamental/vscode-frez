import * as vscode from 'vscode'


export interface CommandsListInterface {
    [name: string]: () => void
}


export function registerCommands(context: vscode.ExtensionContext, commands: CommandsListInterface) {
    for (let [name, command] of Object.entries(commands)) {
        context.subscriptions.push(vscode.commands.registerCommand(`vscode-frez.${name}`, command))
    }
}
