# Snippets by pattern

Snippets by specific pattern.

## Motivation
[Snippets: Scope by specific file or pattern · Issue \#75955 · microsoft/vscode](https://github.com/microsoft/vscode/issues/75955)

## Extension Settings

For example `settings.json`

```json
{
  "snippetsByPattern.snippets": {
    "**/db/migrate/*.rb": {
      "add_index": {
        "prefix": "add_index",
        "body": ["add_index :${1:table_name}, :${2:column_name}"]
      },
      "remove_index": {
        "prefix": "remove_index",
        "body": ["remove_index :${1:table_name}, :${2:column_name}"]
      }
    }
  }
}
```
