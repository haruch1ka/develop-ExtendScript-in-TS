# diary\*\*\*.js

## 概要

ダイアリーへの流し込みを自動で行うスクリプトです。
それぞれ名前に対応するファイルに対して使用できます。

## 使い方

1. スクリプトフォルダに該当スクリプトを移動。
2. 実行
3. 初回実行の際は入稿されたエクセルデータの場所を聞かれる。
4. 初回実行の際はエクセルデータの保存場所がdiary_setting.txtに書き出される。場所はスクリプトを配置したところと同じ。
5. 完了。

## 運用

1. ワンボタンで実行できるようになっています。
2. スクリプトからのデータの読み込みや挿入の際に"エクセルの構造、オブジェクトの名前、スタイル名"やテキストフレームの構造"を手がかりとして利用しています。
   なのでフォーマットの変更により該当箇所が動作しなくなる可能性があります。名前の変更だけであればスクリプトの該当部分を変更すれば実行できます。

## 更新履歴

- 2024/10/09 calenderスクリプトのプロトタイプ版完成。
- 2024/10/25 calenderスクリプト完成。
- 2024/10/29 honshiスクリプト完成。開発ファイルをモジュール事に分離。伴ってcalenderスクリプトの仕様変更。月末/が入っている状態の◯の位置を調整できるようアップデート。ダイアログにコピペする方式から、excelから直接データを読み込む方式に変更。
- 2024/11/06 gekkanスクリプト完成。スクリプトの命名形式をdiary\*\*\*.jsに統一。README.mdの作成。
-
