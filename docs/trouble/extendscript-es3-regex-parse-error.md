# ES3(ExtendScript)では正規表現の文字クラス内の「/」もエスケープ必須（Vitestでは検出不可）

ファイル名の不正文字チェック処理で発生した、ExtendScript実機でのみ起きるパースエラーをまとめる（2026-07-15）。

## 症状

- PowerShell外部COM経由の `DoScript` 実行が `System.NullReferenceException`（内容が失われた汎用COM例外）で落ちる。
- ユニットテスト（Vitest）は全件パスし、ビルド（`tsc` → Rollup）もエラーなしで通る。バンドルに `export` 構文も残っていない。
- [ps-com-indesign-arg-passing.md](ps-com-indesign-arg-passing.md) に記録済みの3原因（`arguments` 参照・古いビルドの実行・`.ps1` のBOM欠落）はいずれも該当しない。

## 原因

```ts
// NG: ES3ではパースエラー（ES5以降・Node/Vitestでは合法）
if (/[\\/:*?"<>|]/.test(name)) { ... }

// OK: 文字クラス内の "/" をエスケープする
if (/[\\\/:*?"<>|]/.test(name)) { ... }
```

- ES5以降の文法では、正規表現リテラルの文字クラス `[...]` 内に置かれたエスケープなしの `/` は合法（`RegularExpressionClass` として扱われる）。
- **ES3の文法にはこの規定がなく、文字クラス内でもエスケープなしの `/` がリテラルの終端と解釈される。** ExtendScriptはES3準拠のため、リテラルが `[\\` で途切れ、残りがトークン列として不正になり「Expected: )」のパースエラーになる。
- パースエラーはスクリプト全体を無効にするため、ExtendScript側の `try/catch` にも到達せず、COM層では内容が失われた汎用の `NullReferenceException` として現れる（CLAUDE.md「エントリファイルで `export` しない」の項に記載の現象と同じ現れ方）。

## Vitest・tsc で検出できない理由

- Vitest は Node.js（最新のJSエンジン）上で実行されるため、ES5以降の文法で合法なこの正規表現は問題なく動き、テストは全件パスする。
- `tsc` も正規表現リテラルの中身を解析しないため、型チェック・コンパイルともエラーにならない。
- つまり **「ユニットテストが通る＝ExtendScriptでパースできる」ではない**。ES3固有の文法差はビルドパイプラインのどこでも検出されない。

## 切り分けに有効だった診断手順

1. **最小スクリプトでCOM経路を確認**: `DoScript('var x = 1 + 1; String(x);', 1246973031)` が成功すれば、COM・InDesign側は正常で問題はスクリプト内容にある。
2. **ExtendScript内部から `app.doScript(File)` でバンドルを実行**: パースエラーの詳細（メッセージ）が例外として取得できる。外側の `DoScript` に文字列で渡すと内容が失われるが、この方式なら「Expected: )」まで判明する。

```javascript
// DoScript に渡す診断ラッパー（エラー内容が返り値として取れる）
(function () {
  try {
    var f = new File("D:/path/to/dist/bundle.js");
    app.doScript(f, ScriptLanguage.JAVASCRIPT);
    return "ok";
  } catch (e) {
    return "ERR: " + e.message + " @line " + e.line;
  }
})();
```

※ このとき返る `e.line` はラッパー側の行番号であり、バンドル内の位置は特定できない。位置の特定は疑わしい構文の検索（`=>`・`let`/`const`・スプレッド・テンプレートリテラル・正規表現リテラル等）や二分探索で行う。

## 教訓

- ExtendScript向けコードの正規表現リテラルでは、**文字クラス内であっても `/` を必ず `\/` とエスケープする**。
- ES3固有のパース差はVitest・tscでは検出できないため、実機での動作確認（受け入れテスト）を省略しない。
- 「COM層の汎用 `NullReferenceException`」はパースエラーの可能性を常に疑い、上記の診断手順（最小スクリプト→`app.doScript(File)` ラッパー）で切り分ける。
