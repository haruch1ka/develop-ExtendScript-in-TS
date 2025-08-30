## 概要

extendScriptをTypeScriptかつesm対応で制作するための開発環境。
Indesignでないスクリプトの作成の際はtsconfig.jsonの
typesを適宜変更すること。

## 使い方

適宜git cloneして必要な依存関係をインストールする。
vscodeの拡張機能は、extendscript-debugの~~ver1.1.2を使用中。updateしたい人はそのverの運用方法を調べて適用してください。~~ ver2.0.3を利用中。アップデート済み。

## 仕様
1. 依存関係をインポート
2. pnpmを用いて、"pnpm build" を実行。
3. build.ts にて、npx tsc , npx rollup , UTF-8 with BOMへの変換が実行される。
4. dist にファイルが出力される。

コンパイラは、src以下のみを監視しているため、外においても反応しません。

## 更新履歴

- 2025/02/01 センシティブなコードを除去した状態で公開範囲をpublicに変更。
- 2025/02/01 制作したスクリプトの切り出し。別gitで管理をするようにする。
- 2025/04/28 Polyfillのtypesを追加。
- 2025/05/31 buildの方法をbuild.jsを利用したものに変更。
- 2025/08/22 buildをリファクタリング。build.tsへ変更。

## memo

切り出した既制作スクリプトをサブモジュール化する。（出来たら）。
