vscode-frez
===========

An extension for my personal VSCode config, because VSCode doesn't give me an
executable init file.


Build
=====

Built packages aren't committed to the repo, so you have to build one locally to
install it.  To build a package to install locally:

```
cd $VSCODE_FREZ_REPO
npm install
make build
```

If you've made changes, you'll need to bump before you build, or just use:

```
make bump-build
```


FAQ
===

Useful VSCode commands for extension development:

- Any command that starts with `Developer: *`
- Developer: Toggle Developer Tools (`workbench.action.toggleDevTools`)


Where to find the full `vscode` API?
------------------------------------

- Intellisense: `import * as vscode from 'vscode'; vscode.*`
  Or goto definition for `vscode`.


How to get a list of all commands (even ones not contributed")?
---------------------------------------------------------------

Set a breakpoint in an extension and from the debug console run:
`vscode.commands.getCommands().then(x => console.log(x))`


Open the default keybindings JSON file with:
`workbench.action.openDefaultKeybindingsFile`: "Preferences: Open Default Keyboard Shortcuts (JSON)"

All bound commands are shown, then all *other* commands are in a comment at the
bottom.  The problem here is that you have to combine those 2 sources...
somehow.


See also:
- https://stackoverflow.com/questions/37844144/vscode-keyboard-command-ids
- https://stackoverflow.com/questions/58367207/list-of-all-available-commands-in-vscode


General `when` Context Notes
----------------------------

Potentially useful commands:

- Developer: Inspect Context Keys (`workbench.action.inspectContextKeys`)
  Not sure what this actually does...


### How to get a list of `when` contexts?

Found this process on SO!  https://stackoverflow.com/a/62202897/645663
Here too!  https://stackoverflow.com/a/57245061/645663

1) Open the developer tools
2) Execute `workbench.action.inspectContextKeys` ("Developer: Inspect Context
   Keys") from the command palette.
3) Click on something
4) An object will be logged with all of the when contexts
5) Right click and "store as global variable" (should be `temp1`)
6) Copy/paste for a "list of when clause contexts" that includes extensions.

7) To test if where you click matters do: `Object.keys(temp1).length` then
   repeat the above (clicking somewhere different)

   7.a) ... it does.  Not only is there a difference between panes (ex: editor
        vs sidebar vs terminal), but there's also a difference between editors
        in different languages (ex: json vs typescript) and possibly different
        parts of the document.

The total context keys vary based on which panel you click, but even when you
confine clicking to an editor it also varies based on what kind of file (json vs
ts differed by 9) and potentially where in the file you click and/or what things
are active and maybe more!

Issues:
- Lift `setContext` from a command to proper API #10471
  https://github.com/Microsoft/vscode/issues/10471
- Add suggestions for key binding when clause contexts #9303
  https://github.com/Microsoft/vscode/issues/9303
- Documentation for the keybinding when condition #641
  https://github.com/Microsoft/vscode-docs/issues/641

Stack Overflow:
- Where can I find possible rules for vscode key bindings?
  https://stackoverflow.com/questions/46540087/where-can-i-find-possible-rules-for-vscode-key-bindings/46547784#46547784
- A method to expose the VSCode active 'when Clause Contexts'
  https://stackoverflow.com/questions/43372232/a-method-to-expose-the-vscode-active-when-clause-contexts


Code:
- https://github.com/microsoft/vscode/blob/master/src/vs/platform/contextkey/common/contextkey.ts
- `inspectContextKeys` action: https://github.com/microsoft/vscode/blob/master/src/vs/workbench/browser/actions/developerActions.ts
- Some `ContextKeyService` implementations: https://github.com/microsoft/vscode/blob/master/src/vs/platform/contextkey/browser/contextKeyService.ts
- Random contexts set in code:
  https://github.com/microsoft/vscode/blob/fc9ff5d569b34222dcff2ca0bfdc62de86dbd112/src/vs/workbench/common/panel.ts#L11


#### The limited stuff I found about this in docs, issues, or the web

> The list here isn't exhaustive and you can find other when clause contexts by
> searching and filtering in the Keyboard Shortcuts editor (Preferences: Open
> Keyboard Shortcuts ) or reviewing the Default Keybindings JSON file
> (Preferences: Open Default Keyboard Shortcuts (JSON)).
>
> - https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts

"search/filter the keyboard shortcuts" is a joke...

- Extension: [When Suggest](https://marketplace.visualstudio.com/items?itemName=usernamehw.when-suggest)

> Context keys are taken from executing `workbench.action.inspectContextKeys`
> "Developer: Inspect Context Keys" on editor with disabled extensions. Some of
> the context keys might be internal.

### `when` context operators

https://code.visualstudio.com/docs/getstarted/keybindings#_conditional-operators


### What is the operator precedence for `when` contexts?

[The AND && operator has a higher precedence over OR ||.](https://code.visualstudio.com/updates/v1_37#_support-for-or-in-when-clauses)


### Regex and keyvalue

> There is a key-value pair operator for when clauses. The expression key =~
> value treats the right hand side as a regular expression to match against the
> left hand side. For example, to contribute context menu items for all Docker
> files, one could use:
>
>      "when": "resourceFilename =~ /docker/"
>
> - [Source](https://code.visualstudio.com/docs/getstarted/keybindings#_keyvalue-when-clause-operator)

### How to add a custom `when` context?

`vscode.commands.executeCommand('setContext', 'extensionSelectionMode', true)`

- https://code.visualstudio.com/api/extension-guides/command#using-a-custom-when-clause-context
- https://stackoverflow.com/questions/44852670/adding-conditions-to-when-from-vs-code-extension
- https://github.com/Microsoft/vscode/issues/10471


How to see what keybinding is being triggered?
----------------------------------------------

Use the keybindings debug console (`C-h C-S-k`): `workbench.action.toggleKeybindingsLog`


What are all the (editor) events I can subscribe to?
----------------------------------------------------

???


How to get the "language configuration"
---------------------------------------

Short answer: There's no API for this.

- [How to get the language configuration in a VSCode extension?](https://stackoverflow.com/q/63536669/645663)

Long answer: [Allow extensions to get a LanguageConfiguration for a language #2871](https://github.com/microsoft/vscode/issues/2871)


Extension Development Notes
===========================


Logging
-------

To achieve something like `console.log`:

```js
let logger = vscode.window.createOutputChannel('frezlog')
logger.appendLine(`foo ${bar}`)
logger.show()
// Seems to work without `logger.show()` at least if `logger.appendLine` is called in `activate`.
```


Prompt User for Choice
----------------------

```ts
var choice = await vscode.window.showInformationMessage('Prompt...', 'Choice 1', 'Choice 2', ...)
if (choice === 'Choice 1') {...}
```


Modify the editor selection
---------------------------

```ts
// Expand the "primary selection"
editor.selection = new vscode.Selection(
    editor.selection.start.translate(0, 1),
    editor.selection.end.translate(0, 1),
)

// Expand all selections
editor.selections = editor.selections.map((sel) => {
    new vscode.Selection(sel.start.translate(0,1), sel.end.translate(0,1))
})
```

- [Updating editor.selections in vscode Extension](https://stackoverflow.com/q/61933072/645663)
- [How can I update the selection after edit?](https://stackoverflow.com/q/54145858/645663)


