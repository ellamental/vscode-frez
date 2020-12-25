/**
 * ###########
 * vscode-frez
 * ###########
 * 
 * An extension for my personal VSCode config, because VSCode doesn't give me an
 * executable init file.
 *
 * ???
 * ===================================================================================================================
 * 
 * - Where to find the full `vscode` API?
 * 
 * - How to get a list of `when` contexts?
 * 
 * - How to see keybindings debug console?
 *   `C-h C-S-k` (`workbench.action.toggleKeybindingsLog`)
 * 
 * - How to get a list of all commands (even ones not "contributed")?
 * 
 * - What are all the (editor) events I can subscribe to?
 */
 
import * as vscode from 'vscode'

import {registerCommands} from './commands'
import * as moveCommands from './commands/move'


let frezlog = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`
// Ex: frezlog.appendLine(`foo`)


export function activate(context: vscode.ExtensionContext) {
    registerCommands(context, moveCommands.commands)
}

// `deactivate` is called when the extension is deactivated.
//
export function deactivate() {}
