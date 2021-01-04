import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


const chunkSize: number = 10


// Center cursor
// ---------------------------------------------------------------------------------------------------------------

async function centerCursor() {
    if (!vscode.window.activeTextEditor) { return }

    await vscode.commands.executeCommand("revealLine", {
        lineNumber: vscode.window.activeTextEditor.selection.active.line,
        at: "center",
    })
}

// Move Cursor
// ---------------------------------------------------------------------------------------------------------------

async function moveCursorToBeginningOfLine() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const currentPosition = editor.selection.active
    const currentLine = editor.document.lineAt(currentPosition.line)

    if (currentPosition.character !== 0) {
        editor.selection = new vscode.Selection(
            editor.selection.anchor,
            editor.selection.active.with(undefined, 0),
        )
    } else {
        editor.selection = new vscode.Selection(
            editor.selection.anchor,
            editor.selection.active.with(undefined, currentLine.firstNonWhitespaceCharacterIndex),
        )
    }
}

function _isSelectionActive() {
    const editor = vscode.window.activeTextEditor
    return editor && !editor.selection.isEmpty
}

/**
 * Move the cursor up/down (direction) by a number of lines (amount), and center the viewport on the cursor.
 */
async function _moveCursorVerticallyAndCenter(direction: string, amount: number) {
    await vscode.commands.executeCommand('cursorMove', { to: direction, by: 'wrappedLine', value: amount, select: _isSelectionActive() })
    centerCursor()
}


function moveDownChunk() {
    _moveCursorVerticallyAndCenter('down', chunkSize)
}

function moveUpChunk() {
    _moveCursorVerticallyAndCenter('up', chunkSize)
}

function moveDownChunks() {
    _moveCursorVerticallyAndCenter('down', chunkSize * 3)
}

function moveUpChunks() {
    _moveCursorVerticallyAndCenter('up', chunkSize * 3)
}

export const commands: ICommandsList = {
    centerCursor,
    moveCursorToBeginningOfLine,
    moveDownChunk,
    moveUpChunk,
    moveDownChunks,
    moveUpChunks,
}
