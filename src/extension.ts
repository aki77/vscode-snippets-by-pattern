import * as vscode from "vscode";
import SnippetProvider, { Snippets } from "./SnippetProvider";
import { copySnippetToClipboard } from "./commands";

let disposables: vscode.Disposable[] = [];

const clear = () => {
  disposables.forEach(disposable => {
    disposable.dispose();
  });
  disposables = [];
};

const reload = () => {
  clear();

  const snippetsByPattern: {
    [pattern: string]: Snippets;
  } = vscode.workspace.getConfiguration("snippetsByPattern").snippets;

  Object.entries(snippetsByPattern).forEach(([pattern, snippets]) => {
    disposables.push(
      vscode.languages.registerCompletionItemProvider(
        { pattern },
        new SnippetProvider(snippets)
      )
    );
  });
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration("snippetsByPattern")) {
        reload();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "snippetsByPattern.copySnippetToClipboard",
      copySnippetToClipboard
    )
  );

  reload();
}

export function deactivate() {
  clear();
}
