import type Config from "~/types/config";

//設定データをlocalStorageから取得するだけ
export default function getConfigLocal():{sync:boolean, config:any}|null {
  try {
    return {
      sync: localStorage.getItem("syncConfig")==="true" ? true : false,
      config: JSON.parse(localStorage.getItem("config"))
    };
  } catch(e) {
    console.log("getConfigLocal :: 設定を読み取れませんでした", e);
    return null;
  }
}
