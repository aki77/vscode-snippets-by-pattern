import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  TextDocument,
  Position,
  SnippetString
} from "vscode";

export type Snippets = {
  [name: string]: {
    prefix: string;
    body: string | string[];
    description: string | null;
  };
};

export default class SnippetProvider implements CompletionItemProvider {
  constructor(private snippets: Snippets) {}

  public provideCompletionItems(document: TextDocument, position: Position) {
    return Object.entries(this.snippets).map(([name, snippet]) => {
      const snippetString = new SnippetString(Array(snippet.body).join("\n"));
      const item = new CompletionItem(
        snippet.prefix,
        CompletionItemKind.Snippet
      );
      item.detail = snippet.description || name;
      item.insertText = snippetString;
      item.documentation = snippetString.value;
      return item;
    });
  }
}
