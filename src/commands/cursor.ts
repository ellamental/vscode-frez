import * as vscode from 'vscode'

import {ICommandsList} from './index'


let logger = vscode.window.createOutputChannel("frezlog")  // Seems to work without: `frezlog.show()`


const chunkSize: number = 10


async function moveCursorToBeginningOfLine() {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const currentPosition = editor.selection.active
    const currentLine = editor.document.lineAt(currentPosition.line)

    if (currentPosition.character === 0) {
        vscode.commands.executeCommand('cursorMove', {
            to: 'wrappedLineFirstNonWhitespaceCharacter',
            select: !editor.selection.isEmpty,
        })
    } else {
        vscode.commands.executeCommand('cursorMove', {
            to: 'wrappedLineStart',
            select: !editor.selection.isEmpty,
        })
    }

    // const currentPosition = editor.selection.active
    // const currentLine = editor.document.lineAt(currentPosition.line)
    // const newPos = editor.selection.active.with(
    //     undefined,
    //     currentPosition.character !== 0 ? 0 : currentLine.firstNonWhitespaceCharacterIndex,
    // )

    // if (editor.selection.active.isEqual(editor.selection.anchor)) {
    //     editor.selection = new vscode.Selection(newPos, newPos)
    // } else {
    //     editor.selection = new vscode.Selection(
    //         editor.selection.anchor,
    //         newPos,
    //     )
    // }
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
    vscode.commands.executeCommand('editor.action.clipboardCopyAction')
    vscode.commands.executeCommand('emacs-mcx.cancel')
}

async function commentAndDeactivateRegion() {
    vscode.commands.executeCommand('editor.action.commentLine')
    vscode.commands.executeCommand('emacs-mcx.cancel')
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
