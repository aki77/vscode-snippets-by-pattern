import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  TextDocument,
  Position,
  SnippetString,
  MarkdownString
} from "vscode";
import { SnippetParser } from "vscode-snippet-parser";

export type Snippets = {
  [name: string]: {
    prefix: string;
    body: string | string[];
    description: string | null;
  };
};

export default class SnippetProvider implements CompletionItemProvider {
  constructor(private snippets: Snippets) {}

  public provideCompletionItems() {
    return Object.entries(this.snippets).map(([name, snippet]) => {
      const body = Array.isArray(snippet.body)
        ? snippet.body.join("\n")
        : snippet.body;
      const snippetString = new SnippetString(body);
      const item = new CompletionItem(
        snippet.prefix,
        CompletionItemKind.Snippet
      );
      item.detail = snippet.description || name;
      item.insertText = snippetString;
      item.documentation = new MarkdownString().appendCodeblock(
        new SnippetParser().text(snippetString.value)
      );
      return item;
    });
  }
}
