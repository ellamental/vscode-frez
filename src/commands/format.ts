import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`

/**
 * An idempotent "indent" command (like `tab` in Emacs).
 *
 * NOTE: The current implementation is a little janky/distracting as it
 * compensates for the implementation of `editor.action.reindentselectedlines`
 * by expanding the selection "upwards" until `reindentselectedlines` does "the
 * right thing".  Unfortunately this happens slow enough to be pretty visible
 * (at least if done naively).
 *
 * Bugs:
 * - Undo leaves the "fake" selection
 * - Reindent on a function definition with a JSDoc comment above it, indents
 *   the function definition to the level of the JSDoc
 */
async function reindentSelectedLines() {

    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const originalSelection = editor.selection
    const startLine = editor.selection.start.line

    // The simplest case: the preceeding line is non-empty, or we're on the first line
    if (!editor.document.lineAt(startLine - 1).isEmptyOrWhitespace) {
        return vscode.commands.executeCommand('editor.action.reindentselectedlines')
    }

    let prevLineNumber = editor.selection.start.line - 1
    while (prevLineNumber >= 0) {
        if (!editor.document.lineAt(prevLineNumber).isEmptyOrWhitespace) { break }
        prevLineNumber = prevLineNumber - 1
    }

    // We only need to "select" up to the line before the first preceeding
    // non-blank line to get `editor.action.reindentselectedlines` to behave
    // correctly.
    //
    // This cuts down some on the visual distraction of expanding the
    // selection.
    prevLineNumber++

    const newSelection: vscode.Selection = new vscode.Selection(
        new vscode.Position(prevLineNumber, 0),
        editor.selection.end,
    )
    editor.selection = newSelection
    await vscode.commands.executeCommand('editor.action.reindentselectedlines')

    // remove trailing whitespace from lines above cursor introduced by ^
    //
    // `editor.action.trimTrailingWhitespace` trims the entire document,
    // including the line the cursor is on (which is undesirable)
    //
    // We should probably do an `editor.edit` to trim just the lines we
    // modified, but I think:
    //
    // 1) The case where there's more than 1 blank line is pretty rare
    // 2) If you have the `"files.trimTrailingWhitespace": true` setting,
    //    the whitespace will be removed on save anyway.
    await vscode.commands.executeCommand('editor.action.trimTrailingWhitespace')

    editor.selection = originalSelection

    // // Just 1 blank line
    // if (!editor.document.lineAt(startLine - 2).isEmptyOrWhitespace) {
    //     const newSelection: vscode.Selection = new vscode.Selection(
    //         editor.selection.start.translate(-2),
    //         editor.selection.end,
    //     )
    //     editor.selection = newSelection
    //     await vscode.commands.executeCommand('editor.action.reindentselectedlines')
    //     // remove any trailing whitespace introduced by ^  (but not from current line of cursor!)
    //     editor.selection = originalSelection
    //     return
    // }

    // await vscode.commands.executeCommand('editor.action.reindentselectedlines')
}


export const commands: ICommandsList = {
    reindentSelectedLines,
}
