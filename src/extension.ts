/**
 * extension.ts
 * ============
 * 
 * The entrypoint for the `vscode-frez` extension.
 * 
 * An extension for my personal VSCode config, because VSCode doesn't give me an
 * executable init file.
 * 
 * See Also
 * ===================================================================================================================
 * 
 * - StackOverflow tagged vscode-extensions: https://stackoverflow.com/questions/tagged/vscode-extensions
 */

import * as vscode from 'vscode'

import {registerCommands, miscCommands} from './commands'
import * as moveCommands from './commands/move'
// import * as emacsTab from './commands/emacs-tab'


export function activate(context: vscode.ExtensionContext) {
    registerCommands(context,
        miscCommands,
        moveCommands.commands,
    )
}

// `deactivate` is called when the extension is deactivated.
//
export function deactivate() {}
