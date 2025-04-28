## 概要

extendScriptをTypeScriptかつesm対応で制作するための開発環境。
Indesignでないスクリプトの作成の際はtsconfig.jsonの
typesを適宜変更すること。

## 使い方

適宜gitcloneして必要な依存関係をインストールする。
拡張機能、extendscript-debugのver0.2.0を使用中。
updateしたい人はそのverの運用方法を調べて適用してください。

## 仕様

1. pnpmを用いて、tscを実行してts→jsにコンパイル。compiledフォルダに出力
2. pnpmを用いて、rollupを実行してバンドル。distフォルダに出力
3. dist内に出力された、jsファイルはUTF-8 with BOMで保存してください。(AEの場合は気にしなくて良い。)

コンパイラは、src以下のみを監視しているため、外においても反応しません。

## 更新履歴

- 2025/02/01 センシティブなコードを除去した状態で公開範囲をpublicに変更。
- 2025/02/01 制作したスクリプトの切り出し。別gitで管理をするようにする。
- 2025/04/28 Polyfillのtypesを追加。

## memo

切り出した既制作スクリプトをサブモジュール化する。（出来たら）。
