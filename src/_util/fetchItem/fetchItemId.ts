const fetchItemId = (obj: any) => {
  const ObjID = obj.toSource();
  const ObjIDrev = ObjID.split("@id=").reverse().join(""); //オブジェクトのSourceを区切る
  const result = ObjIDrev.indexOf("]"); //ID番号までの文字数を取得
  const targetID = ObjIDrev.substr(0, result);
  return Number(targetID);
};

export default fetchItemId;
