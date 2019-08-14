import * as vscode from "vscode";
import SnippetProvider, { Snippets } from "./SnippetProvider";

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
  reload();
}

export function deactivate() {
  clear();
}
