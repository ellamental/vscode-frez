import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`

const chunkSize: number = 10

/**
 * Move the cursor to the beginning of the line or the first non-whitespace
 * character.
 *
 * To respect `emacs-mcx.inMarkMode`, use the following keybindings:
 *
 *     { "key": "ctrl+a", "command": "vscode-frez.moveCursorToBeginningOfLine" },
 *     { "key": "ctrl+a", "command": "vscode-frez.moveCursorToBeginningOfLine", "args": true, "when": "emacs-mcx.inMarkMode" },
 */
async function moveCursorToBeginningOfLine(inMarkMode: boolean) {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const currentPosition = editor.selection.active

    if (currentPosition.character === 0) {
        vscode.commands.executeCommand('cursorMove', {
            to: 'wrappedLineFirstNonWhitespaceCharacter',
            select: inMarkMode,
        })
    } else {
        vscode.commands.executeCommand('cursorMove', {
            to: 'wrappedLineStart',
            select: inMarkMode,
        })
    }
}

async function centerCursor() {
    if (!vscode.window.activeTextEditor) { return }

    await vscode.commands.executeCommand("revealLine", {
        lineNumber: vscode.window.activeTextEditor.selection.active.line,
        at: "center",
    })
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

async function popAndSetMark() {
    // await vscode.commands.executeCommand('emacs-mcx.popMark')
    await vscode.commands.executeCommand('emacs-mcx.cancel')
    await vscode.commands.executeCommand('emacs-mcx.setMarkCommand')
}

async function copyAndDeactivateRegion() {
    await vscode.commands.executeCommand('editor.action.clipboardCopyAction')
    await vscode.commands.executeCommand('emacs-mcx.cancel')
}

async function commentAndDeactivateRegion() {
    await vscode.commands.executeCommand('editor.action.commentLine')
    await vscode.commands.executeCommand('emacs-mcx.cancel')
}

async function listMoveDownChunk() {
    vscode.commands.executeCommand('list.focusDown')
    vscode.commands.executeCommand('list.focusDown')
    vscode.commands.executeCommand('list.focusDown')
    vscode.commands.executeCommand('list.focusDown')
    vscode.commands.executeCommand('list.focusDown')
}

async function listMoveUpChunk() {
    vscode.commands.executeCommand('list.focusUp')
    vscode.commands.executeCommand('list.focusUp')
    vscode.commands.executeCommand('list.focusUp')
    vscode.commands.executeCommand('list.focusUp')
    vscode.commands.executeCommand('list.focusUp')
}

export const commands: ICommandsList = {
    moveCursorToBeginningOfLine,
    centerCursor,
    moveDownChunk,
    moveUpChunk,
    moveDownChunks,
    moveUpChunks,
    popAndSetMark,
    commentAndDeactivateRegion,
    listMoveDownChunk,
    listMoveUpChunk,
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
