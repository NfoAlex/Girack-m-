//設定データをlocalStorageへ書き込むだけ
export default function setConfigLocal(syncConfig:boolean, configData:object) { //objectとあるがref型のJSON
  try {
    //設定を同期するのかどうか
    localStorage.setItem("syncConfig", syncConfig.toString());
    //設定そのもの
    localStorage.setItem("config", JSON.stringify(configData));
  } catch(e) {
    console.log("setConfigLocal :: 設定データの書き込みができませんでした。", e);
  }
}
