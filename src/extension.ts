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

import {registerCommands, commands} from './commands'
import * as cursor from './commands/cursor'
import * as format from './commands/format'
import * as inspect from './commands/inspect'


export function activate(context: vscode.ExtensionContext) {
    registerCommands(context,
        commands,
        cursor.commands,
        format.commands,
        inspect.commands,
    )
}

// `deactivate` is called when the extension is deactivated.
//
export function deactivate() {}
