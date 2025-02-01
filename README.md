## 概要

extendScriptをTypeScriptかつesm対応で制作するための開発環境。

## 使い方

適宜gitcloneして必要な依存関係をインストールする。
拡張機能、extendscript-debugのver0.2.0を使用中。
updateしたい人はそのverの運用方法を調べて適用してください。

## 仕様

1.pnpmを用いて、tscを実行してts→jsにコンパイル。compiledフォルダに出力
2.pnpmを用いて、rollupを実行してバンドル。distフォルダに出力
3.dist内に出力された、jsファイルはUTF-8 with BOMで保存してください。

コンパイラは、src以下のみを監視している。ため、外においても反応しません。

## 更新履歴
