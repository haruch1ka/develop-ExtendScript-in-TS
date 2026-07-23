# InDesignテンプレート構成の誤認とPDFエクスポート設定のバグ

InDesignテンプレートを使ったPDF生成スクリプトの開発中に発生した、InDesign固有の実機依存バグをまとめる。

## テンプレートの実体誤認

テンプレートの `.indd` は当初「1テキストフレームのみ」と想定していたが、実際は**31ページあり各ページに1つずつテキストフレームがある構成**（同一デザインの繰り返し）だった。診断用スクリプトで確認（`layers.length=1`, `layer[0].pageItems.length=31`, `page0.textFrames.length=1`）。

**対応**: ユーザーが手動でテンプレートを1ページのみに修正。コード側も `doc.layers.item(0).pageItems`（レイヤー全体、全ページ分を含む誤り）→ `doc.pages.item(0).allPageItems`（1ページ目のみ。既存コードと同じ正しいパターン）に修正。

**教訓**: 複数ページを持つ `.indd` から要素を取得する際、`layer.pageItems` はレイヤー全体（全ページ分）を返すため、特定ページに絞りたい場合は `page.allPageItems` を使う。

## PDFエクスポート設定（`applyPdfExportSettings()`）の一連のバグ

- `pref.colorBitmapCompression = BitmapCompression.NONE` と `pref.colorBitmapQuality = CompressionQuality.MAXIMUM` を同時設定すると「現在の状態でこのプロパティを適用できません」エラー。無圧縮なら画質設定自体が不要なため `colorBitmapQuality` の行を削除して解決。
- 同様に `pref.colorBitmapSampling = Sampling.NONE`（再サンプルしない）と `pref.colorBitmapSamplingDPI = 300` の同時設定も同じエラー。DPI指定は実際に再サンプルする場合のみ意味を持つため `colorBitmapSamplingDPI` の行を削除して解決。
- **`exists=false` で書き出し済みPDFが見つからないバグ**: `doc.exportFile(ExportFormat.PDF_TYPE, outputFile, false)` を実行すると、指定したファイル名（例: `test_ascii.pdf`）と同名の**フォルダ**が作られ、その中に `test_ascii_[01].pdf` という連番PDFが生成されていた（`exportAsSinglePages` プロパティのデフォルト/残存値が `true` だったため。「各ページを別PDFとして書き出す」設定）。**対応**: `pref.exportAsSinglePages = false` を明示的に設定して解決。日本語ファイル名でも動作確認済み（`exists=true`、420KB前後の実体PDF）。
- **トンボ（クロップマーク）除去**: `pref.cropMarks = false` のみでは効果がなく、`allPrinterMarks` というプロパティを試したが `app.pdfExportPreferences` の実際の型には存在しない（`tsc` の型エラーで発覚、indesignjs.deの公式相当ドキュメントでも確認）。**対応**: `cropMarks` / `bleedMarks` / `registrationMarks` / `colorBars` / `pageInformationMarks` の5つを個別に `false` に設定する形に確定。実機でトンボが消えたことを確認済み（2026-07-15）。

**教訓**: `app.pdfExportPreferences` の各プロパティは、互いに排他的な組み合わせ（圧縮方式と画質、再サンプル有無とDPI）を同時設定すると実行時エラーになる。設定不要なプロパティは省略する。
