//設定データをlocalStorageへ書き込むだけ
export default function setConfigLocal(configData: object) {
  //objectとあるがref型のJSON
  try {
    //設定そのもの
    localStorage.setItem("config", JSON.stringify(configData));
  } catch (e) {
    console.log(
      "setConfigLocal :: 設定データの書き込みができませんでした。",
      e,
    );
  }
}
