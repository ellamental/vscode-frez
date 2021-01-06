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
 *
 * Relevant VSCode Issues
 * ----------------------
 *
 * - Improve indentation rules #17868
 *   https://github.com/microsoft/vscode/issues/17868
 *
 * - Explore using formatters for indentation adjustment when formatters are available #19847
 *   https://github.com/microsoft/vscode/issues/19847
 *
 * - Reindent Lines does nothing if indentationRules do not exist #111088
 *   https://github.com/microsoft/vscode/issues/111088
 *
 * - Reindent Selected Lines command bug? #51458
 *   https://github.com/microsoft/vscode/issues/51458
 *
 * - 'Reindent Lines' produces different indentation than 'Format Document' in TypeScript #32835
 *   https://github.com/Microsoft/vscode/issues/32835
 *
 * - 'reindent all lines' removes leading space in comment #19142
 *   https://github.com/microsoft/vscode/issues/19142
 *
 * - Unify indentation and formatting APIs #34621
 *   https://github.com/microsoft/vscode/issues/34621
 *
 * - Auto Indent / Code Formatting / Beautify #4039 (massive aggregate issue with no resolutions)
 *   https://github.com/microsoft/vscode/issues/4039
 *
 * - Options for automatic indentation #19303
 *   https://github.com/microsoft/vscode/issues/19303
 *
 * - 'reindent all lines' and formatter have different formatting strategies #19140
 *   https://github.com/microsoft/vscode/issues/19140
 *
 */

// Related comments from my keybindings.json file...
//
// TAB
//
// I want an emacs-style `TAB` damnit!
//
// - `editor.action.formatSelection` is great at indenting, but it will
//   sometimes do more than that...  (ex: may turn a single line expression into
//   multiple lines)
//
//   - `editor.action.formatSelection` "bugs":
//     - When on a newline, there are many instances where TAB will not indent
//       properly until there's text present.
//     - In `keybindings.json`, put a closing bracket at the start of a line and
//       press TAB.  It doesn't propertly indent.  It seems to "round down" to
//       the next "level of indentation" (4 spaces), regardless of where the
//       closing bracket is (even if it's 5 levels of indentation out!).
//     - It also doesn't seem to work for comment lines at all
//
//   - "I'm thinking about a similar solution like running formatting on
//     indentation characters and see what's the proper edits a formatter would
//     provide. That means we run format on leading whitespaces instead of whole
//     lines"
//     https://github.com/Microsoft/vscode/issues/19847#issuecomment-277348907
//
//     - Problems with this approach:
//       - Still just "rounds down" in JSON
//       - What to do when there's no leading spaces?!
//       - For multi-line selections, how to select just leading spaces to run
//         this on?  One method I just tried is "column selection mode", and you
//         only need to select a single whitespace character on each line (which
//         is nice), however...
//         - In JSON (at least), it still just rounds down... even if two lines
//           are at different indents.  IOW it won't equalize the indentation.
//
// - `editor.action.reindentselectedlines` sucks! Ex: It will outdent if the
//   previous line is blank (I'm pretty sure unconditionally)
//   https://github.com/Microsoft/vscode/issues/32835
//
// - `garaemon.vscode-emacs-tab` isn't horrible, but throws errors in `json` and
//   `rst` files (at least).  It also seems to not work when multiple lines are
//   selected (not sure if always or if there's a particular condition).
//
//   - `vscode-frez.emacs-tab` This is just `garaemon.vscode-emacs-tab` but
//     local so I can debug it.
//
// - Just plain useless extensions:
//   - `sakapoko.vscode-emacs-indent` is just `reindentselectedlines`
//   - `sandipchitale.vscode-indent-line` - this is just formatSelection with
//     extra cursor movements
//
// - `vscode-frez.tab` WIP for just implementing this myself...
//
// vscode issues for `formatSelection` and `reindentselectedlines`:
//
// - Unify indentation and formatting APIs #34621
//   https://github.com/microsoft/vscode/issues/34621
// - Explore using formatters for indentation adjustment when formatters are available #19847
//   https://github.com/microsoft/vscode/issues/19847
// - Improve indentation rules #17868
//   https://github.com/microsoft/vscode/issues/17868
// - Allow more powerful onEnterRules for cursor alignment #66235
//   https://github.com/microsoft/vscode/issues/66235


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
 * - Doesn't indent if the line you're on is empty
 */
async function formatSelectedLines() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const currentLine = editor.document.lineAt(editor.selection.active.line)
    if (currentLine.text.length === 0) {
        // reindentselectedlines will fail to indent if the previous line is
        // empty, but also if you're in Python.  So the backspace+enter hack
        // is what we're going with... fml
        await vscode.commands.executeCommand<void>("deleteLeft")
        await vscode.commands.executeCommand<void>("default:type", { text: "\n" })
        return
    }
    if (currentLine.isEmptyOrWhitespace) {
        // This is going to be wrong some of the time, but probably better than
        // jumping back-and-forth between indented and not.
        return
    }

    // If there are no changes needed, `executeFormatRangeProvider` will return
    // `undefined`.
    //
    // There must be a valid range for `vscode.executeFormatRangeProvider` to
    // return a value.
    //
    // The "formatting" may produce a number of edits, but we're only concerned
    // with the first (well... the first part of the first), which is the amount
    // to indent the current line.

    if (editor.selection.start.line === editor.selection.end.line) {
        await _indentLineWithFormatCommand(editor, editor.selection.start.line)
    } else {
        // TODO(nick): Implement format lines
        const startLine = editor.selection.start.line
        const endLine = editor.selection.end.line
        for (var line=startLine; line <= endLine; line++) {
            await _indentLineWithFormatCommand(editor, line)
        }
    }
    // TODO(nick): If cursor is in the leading whitespace, move it to the first
    //             non-whitespace character.
}


async function _indentLineWithFormatCommand(editor: vscode.TextEditor, lineNumber: number) {
    const currentLine = editor.document.lineAt(lineNumber)
    const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
        'vscode.executeFormatRangeProvider',
        editor.document.uri,
        currentLine.range,
        { insertSpaces: true, tabSize: 4 } as vscode.FormattingOptions,
    )
    if (edits) {
        if (!edits[0].newText.startsWith('\n')) {
            // This happens (at least in JSON) when the line is already indented
            // correctly, but the formatter wants to break the line into multiple
            // lines (which we don't want).  Fortunately the indent action is
            // separated from the formatting action (at least for the default JSON
            // language server).

            if (edits[0].range.start.character <= currentLine.firstNonWhitespaceCharacterIndex) {
                // This prevents adding spaces if the line is already correctly
                // indented and the first edit is a whitespace only edit.
                //
                // For an example, if this is called on the following line in a
                // typescript file, and that line is already properly indented,
                // the formatter will try to add spaces around the `=` in
                // `line=startLine`.
                //
                //     for (var line=startLine; line <= endLine; line++) {
                //
                editor.edit((editBuilder) => {
                    editBuilder.replace(edits[0].range, edits[0].newText)
                })
            }
        }
    }

    return

    // // One possible implementation is to select the "first word" and run
    // // `formatselection`.  This appears to avoid the "reformat line" problem.
    // //
    // // But it appears as though the "first word" is at least somewhat nuanced,
    // // and this implementation doesn't work for a typescript line that contains:
    // //
    // // `        'vscode.executeFormatRangeProvider',`
    // //
    // // Unfortunately selecting just the whitespace or the whitespace and the
    // // first character of the first word doesn't indent as expected (though this
    // // does seem to work if the first character is a bracket).
    // //
    // const firstWordRange = editor.document.getWordRangeAtPosition(new vscode.Position(lineNumber, currentLine.firstNonWhitespaceCharacterIndex))
    // console.log('firstWordRange: ', firstWordRange)
    //
    // const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
    //     'vscode.executeFormatRangeProvider',
    //     editor.document.uri,
    //     firstWordRange,
    //     // currentLine.range,
    //     { insertSpaces: true, tabSize: 4 } as vscode.FormattingOptions,
    // )
    // if (edits) {
    //     editor.edit((editBuilder) => {
    //         editBuilder.replace(
    //             edits[0].range,
    //             edits[0].newText.replace(/\n|\r/g, '')
    //         )
    //     })
    // }
}

/**
 * A "indent" command (like `tab` in Emacs).
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

    console.log('editor.selection.end: ', editor.selection.end)

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
    // await vscode.commands.executeCommand('editor.action.trimTrailingWhitespace')

    editor.selection = originalSelection
}


/**
 * A super hacky method for indenting the current line
 *
 * This uses the `onEnterRules` for whatever language is currently active.
 *
 * Bugs:
 * - This method just continually adds to the edit/undo history
 * - If a closing bracket is the first non-whitespace character on the current
 *   line, this will indent one level too far.
 * - If on a line with only whitespace, this will duplicate the whitespace.
 */
async function onEnterIndentCurrentLine() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const currentLineNumber = editor.selection.active.line
    const currentLine = editor.document.lineAt(currentLineNumber)
    const currentLineText = currentLine.text
    const firstNonWhitespaceIndex = currentLineText.search(/\S/)

    // Remove whitespace from current line
    editor.edit((editBuilder) => {
        if (firstNonWhitespaceIndex !== -1) {
            editBuilder.replace(
                new vscode.Range(currentLineNumber, 0, currentLineNumber, firstNonWhitespaceIndex),
                '',
            )
        } else {
            editBuilder.replace(
                currentLine.range,
                '',
            )
        }
    })

    // goto start of line
    editor.selection = new vscode.Selection(
        editor.selection.start.with(undefined, 0),
        editor.selection.start.with(undefined, 0),
    )
    // backspace + enter
    await vscode.commands.executeCommand('deleteLeft')
    await vscode.commands.executeCommand('default:type', { text: '\n' })
    // TODO(nick): Go to first non-whitespace character
}


export const commands: ICommandsList = {
    formatSelectedLines,
    reindentSelectedLines,
    onEnterIndentCurrentLine,
}
