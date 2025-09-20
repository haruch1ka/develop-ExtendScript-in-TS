import addBOM from "./addBOM.ts";
export default {
  input: `${process.env.TARGET_FILE}`,
  output: {
    dir: "dist", // 「dist」ディレクトリーの下にビルド後のファイルを生成する
    entryFileNames: "[name].js", // 生成物のファイル名は input のキー名とする
    // 今回は「desktop.js」というファイルが生成される
  },
  plugins: [addBOM()],
};
