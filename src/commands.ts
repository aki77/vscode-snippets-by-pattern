import { TextEditor, env, window } from "vscode";

const getIndentNumber = (text: string) => {
  const matched = text.match(/^\s+/);
  return matched ? matched[0].length : 0;
};

const getPrefix = (text: string) => {
  const matched = text.match(/[a-zA-Z0-9_]+/);
  return matched ? matched[0] : "";
};

const text2SnippetJson = (text: string) => {
  const indentNumber = getIndentNumber(text);
  const indentPattern = new RegExp(`^\\s{${indentNumber}}`);
  const prefix = getPrefix(text);
  const snippet = {
    [prefix]: {
      prefix,
      body: text.split("\n").map(line => line.replace(indentPattern, ""))
    }
  };
  const json = JSON.stringify(snippet, null, 2);
  const trimPattern = /^\s{2}/;
  const [, ...jsonLines] = json.split("\n");
  jsonLines.pop();
  return jsonLines.map(part => part.replace(trimPattern, "")).join("\n");
};

export const copySnippetToClipboard = (editor: TextEditor) => {
  if (editor.selection.isEmpty) {
    return;
  }
  const text = editor.document.getText(editor.selection);
  const json = text2SnippetJson(text);
  env.clipboard.writeText(json);
  window.showInformationMessage("Snippet json copied!");
};
