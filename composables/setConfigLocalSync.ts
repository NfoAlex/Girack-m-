//設定データをlocalStorageへ書き込むだけ
export default function setConfigLocalSync(syncConfig:boolean) { //objectとあるがref型のJSON
  try {
    //設定を同期するのかどうか
    localStorage.setItem("syncConfig", syncConfig.toString());
  } catch(e) {
    console.log("setConfigLocalSync :: 同期設定の書き込みができませんでした。", e);
  }
}
