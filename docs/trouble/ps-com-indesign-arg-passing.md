# PowerShell外部COM経由のInDesign実行で引数受け渡しに失敗し続けた問題

Node → PowerShell → InDesign COM（`DoScript`）の実行フローで、ExtendScriptへの引数受け渡しが `System.NullReferenceException` 等で失敗し続けた。原因は1つではなく **3つの独立した問題が重なっていた**ため、切り分けに時間がかかった。同種の構成（Node側の実行スクリプト → PowerShellの `.ps1` → ビルド済み `.jsx`）を作る際の参考として記録する。

## 症状

- `$adobeApp.DoScript(script, 1246973031, $scriptArgs)` を実行すると `System.NullReferenceException`（「オブジェクト参照がオブジェクト インスタンスに設定されていません」）で落ちる。
- ExtendScript側の `try/catch` にも到達せず、ログファイルも作成されない（＝スクリプト本体が実行される前にCOM層で死んでいる）。
- 同じ処理内容でもパスをハードコードしたベタ書きスクリプトなら成功するため、「引数の渡し方が原因」に見えた。

## 原因1: `DoScript` 第3引数（`arguments`）方式はCOM層で壊れている

PowerShell外部COM経由の `DoScript` で第3引数に値を渡し、ExtendScript側で `arguments` を参照する方式は、**`arguments` という識別子に一度でも触れるだけで**（`arguments.length` を読むだけでも）COM層の `NullReferenceException` を起こす。配列/スカラー/連結文字列など渡し方を変えても解消しない。

**解決**: `DoScript` の第3引数を使わず、key-value方式のAPIに置き換える。

- PowerShell側: `$adobeApp.ScriptArgs.SetValue("excelPath", $excelPath)` を渡したいキーの数だけ呼び、`DoScript` は第2引数（言語指定 `1246973031`）までで呼ぶ。
- ExtendScript側: `app.scriptArgs.getValue("excelPath")` で受け取り、使用後に `app.scriptArgs.clear()`。
- 共有モジュール側の入れ子VBScript呼び出しも同じ `scriptArgs` パターンで実績あり。
- CLAUDE.md にも恒久ルールとして記載済み。

## 原因2: Rollupの出力先分岐により、実行対象ファイルが更新されていなかった

`config/rollup.config.ts` に「特定エントリのみ出力先を `dist/` ではなく `src/__lib/<プロジェクト>/` に変える」分岐が入っていた一方、PowerShellに渡すスクリプトパス（`config.node.ts` の `distScriptPath`）は `dist/*.js` を指したままだった。このため**コードをどう修正してビルドし直しても、実際にInDesignで実行されるのは古いスナップショットのまま**で、切り分け実験の結果がすべて無効になっていた。

**解決**: 出力先を `dist/` に統一（特別分岐を削除）。

**教訓**: 実行が失敗し続けるときは、まず「実行されているファイルは本当に最新ビルドか」をタイムスタンプで確認する（`ls -la --time-style=full-iso dist/xxx.js`）。

## 原因3: `.ps1` がBOMなしUTF-8で保存されていた

日本語コメントを含む `.ps1` をBOMなしUTF-8で保存すると、`powershell -File` 実行時に日本語文字の境界でパーサーがズレる。今回は次の2形態で現れた。

- 行番号のずれたパースエラー（`予期しないトークン '}' を使用できません`）。
- パースは通るがステートメントが壊れ、`New-Object -ComObject InDesign.Application.2026` の結果が `$adobeApp` に入らず、後続の `.SetValue()` / `.DoScript()` で「null 値の式ではメソッドを呼び出せません」（`RuntimeException`）になる。COM起動失敗と誤認しやすい。

**解決**: `.ps1` をBOM付きUTF-8で保存する。

```powershell
$utf8bom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($path, $content, $utf8bom)
```

確認方法: 先頭3バイトが `239,187,191`（EF BB BF）ならBOMあり。

```powershell
[System.IO.File]::ReadAllBytes($path)[0..2] -join ','
```

**教訓**: このリポジトリは「ExtendScript(.jsx)はBOM必須」をビルドで担保しているが、`.ps1` はビルド対象外のため手動保存時にBOMが落ちやすい。日本語を含む `.ps1` を作成・編集したら必ずBOMを確認する。

## 切り分けを迷走させた要因（再発防止）

1. **原因が3つ重なっていた**: 原因1（scriptArgs方式への切り替え）を正しく適用しても、原因2・3が残っているため失敗し続け、「対応が間違っていた」と誤認した。1つ直したら**必ず他の変数を固定したまま再実行**して効果を確認する。
2. **`New-Object` が `try` の外にあり、`-ErrorAction Stop` もなかった**: 失敗が握りつぶされ、真のエラー位置が `DoScript` 行に見えた。COMオブジェクト取得は `try` 内で `-ErrorAction Stop` 付きで行う。
3. **`Get-Process -Name 'InDesign*'` がInDesignプロセスを取りこぼすことがある**: 起動確認は `Get-Process | Where-Object { $_.ProcessName -like '*Design*' }` のように広めに検索する。

## 動作確認済みの最終構成（2026-07-15）

- Node側: パス一覧ファイルを読み、`spawnSync` で `powershell -ExecutionPolicy Bypass -File 実行用.ps1 -scriptPath ... -excelPath ... -templatePath ... -outputDir ...` を個別 `[string]` パラメータで起動（配列パラメータは `-File` モードでバインドされないため不可）。
- `.ps1`（BOM付きUTF-8）: `try` 内で `New-Object -ComObject InDesign.Application.2026 -ErrorAction Stop` → `ScriptArgs.SetValue()` × 3 → `DoScript(script, 1246973031)`。
- ExtendScript側: `app.scriptArgs.getValue()` で受け取り。日本語パスを含む実データでPDF生成成功を確認。
