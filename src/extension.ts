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
 * - Can I get the "direction" of a selection (the origin and termination point,
 *   as opposed to just the start/end positions)?
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


export function activate(context: vscode.ExtensionContext) {

    const chunkSize: number = 10

    // function getSelection() {
    //     // TODO(nick): In Emacs, `point` is not always at the beginning of an
    //     //             active region (selection).  It sometimes matters... at a
    //     //             minimum, commands that deactivate the region should leave
    //     //             the cursor at `point` (not `mark`).
    //     //
    //     //             All the extension I've seen that implement point/mark do
    //     //             it with some internal state that tracks the point/mark.
    //     //             This may be necessary
    //     //
    //     //             Can we get the "direction" of a selection?  If so, we
    //     //             could potentially implement `point/mark` without relying
    //     //             on an extention's internal state.
    // }

    function isSelectionActive() {
        const editor = vscode.window.activeTextEditor
        return editor && !editor.selection.isEmpty
    }

    // Center cursor
    // -------------

    function centerCursor() {
        const editor = vscode.window.activeTextEditor
        if (!editor) { return }
        const currentLine = editor.selection.start.line
        vscode.commands.executeCommand("revealLine", {
            lineNumber: currentLine,
            at: "center",
        })
    }

    // Move Cursor
    // ---------------------------------------------------------------------------------------------------------------

    /**
     * Move the cursor up/down (direction) by a number of lines (amount), and center the viewport on the cursor.
     */
    function _moveCursorVerticallyAndCenter(direction: string, amount: number) {
        vscode.commands.executeCommand('cursorMove', {to: direction, by: 'wrappedLine', value: amount, select: isSelectionActive()})
        centerCursor()
        // vscode.commands.executeCommand('editorScroll', {to: direction, by: 'wrappedLine', value: amount})
        // vscode.commands.executeCommand('editorScroll', {to: direction, by: 'wrappedLine', value: amount, revealCursor: true})
    }

    context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.moveDownChunk', () => {
        _moveCursorVerticallyAndCenter('down', chunkSize)
    }))

    context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.moveUpChunk', () => {
        _moveCursorVerticallyAndCenter('up', chunkSize)
    }))

    context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.moveDownChunks', () => {
        _moveCursorVerticallyAndCenter('down', chunkSize * 3)
    }))

    context.subscriptions.push(vscode.commands.registerCommand('vscode-frez.moveUpChunks', () => {
        _moveCursorVerticallyAndCenter('up', chunkSize * 3)
    }))

}

// `deactivate` is called when the extension is deactivated.
//
export function deactivate() {}
