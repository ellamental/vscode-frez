/**
 * Is there any way we can avoid doing this?!
 *
 * Possible extensions:
 *
 * - avasilev.tab-anywhere
 *   https://github.com/alxvasilev/tab-anywhere/blob/master/extension.js
 *
 * - garaemon.customize-indentation-rules
 *   https://github.com/garaemon/vscode-customize-indentation-rules/blob/master/src/extension.ts
 *
 * Also... There might be some bad behavior that needs correcting with Python
 * (given 300k+ downloads of this ext):
 * - kevinrose.vsc-python-indent
 */

import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


/**
 * An idempotent "indent" command (like `tab` in Emacs).
 *
 * This uses the "formatting provider" instead of the `reindent` commands.
 *
 * Bugs:
 * - In JSON it just "rounds down" the indentation to the previous indent level,
 *   which is rarely right.
 */
async function formatSelectedLines() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    // If there are no changes needed, `executeFormatRangeProvider` will return
    // `undefined`.
    //
    // There must be a valid range for `vscode.executeFormatRangeProvider` to
    // return a value.
    //
    // The "formatting" may produce a number of edits, but we're only concerned
    // with the first (well... the first part of the first), which is the amount
    // to indent the current line.

    const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>('vscode.executeFormatRangeProvider',
        editor.document.uri,
        editor.document.lineAt(editor.selection.active.line).range,
        { insertSpaces: true, tabSize: 4 } as vscode.FormattingOptions,
    )

    // const rangeStart = editor.document.lineAt(editor.selection.active.line).range.start
    // const rangeEnd = editor.document.lineAt(editor.selection.active.line).range.end
    // console.log('rangeStart: ', rangeStart)
    // console.log('rangeEnd: ', rangeEnd)
    // console.log('edits: ', edits)

    if (edits) {
        editor.edit((editBuilder) => {
            if (!edits[0].newText.startsWith('\n')) {
                // This happens (at least in JSON) when the line is already
                // indented correctly, but the formatter wants to break the line
                // into multiple lines (which we don't want).  Fortunately the
                // indent action is separated from the formatting action (at
                // least for the default JSON language server).
                editBuilder.replace(
                    edits[0].range,
                    edits[0].newText.replace(/\n|\r/g, ''),
                )
            }
        })
    }

    // TODO(nick): If cursor is in the leading whitespace, move it to the first
    //             non-whitespace character.
}


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
 *   - When removing trailing whitespace it inserts 2 actions into the undo
 *     chain (insert whitespace, then remove trailing whitespace)
 * - Reindent on a function definition with a JSDoc comment above it, indents
 *   the function definition to the level of the JSDoc
 * - Not actually idempotent (repeated presses just fill the undo history with
 *   inserting/removing whitespace)
 *   - We should compute if an edit is necessary before introducing one...
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
}


export const commands: ICommandsList = {
    formatSelectedLines,
    reindentSelectedLines,
}
