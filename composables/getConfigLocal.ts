import type Config from "~/types/config";

//設定データをlocalStorageから取得するだけ
export default function getConfigLocal(): {
  sync: boolean;
  config: Config;
} | null {
  try {
    const sync = localStorage.getItem("sync") === "true";
    const config = JSON.parse(localStorage.getItem("config") ?? "{}");
    return {
      sync: sync,
      config: config,
    };
  } catch (e) {
    console.log("getConfigLocal :: 設定を読み取れませんでした", e);
    return null;
  }
}
