<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

//メンションデータ用interface
interface SearchData {
  query: string, //検索文字列
  searching: boolean, //検索モードに入っているかどうか
  selectedIndex: number, //選択しているもの
  searchStartingAt: number, //検索モードに入った文字位置
  searchEndingAt: number, //検索文字列の範囲終わり(文字列全体の長さ - searchStartingAt)
  txtLengthWhenStartSearching: number, //検索をし始めたときの文字列全体の長さ
  searchingTerm: "user"|"channel", //ToDo::(!現在未使用!)検索するもの("user" | "channel")
};

/**
 * data
 */
const messageInput = ref<string>(""); //メッセージ入力用変数
const searchData = ref<SearchData>({ //検索データ
  query: '',
  searching: false,
  selectedIndex: 0,
  searchStartingAt: 0,
  searchEndingAt: 0,
  txtLengthWhenStartSearching: 0,
  searchingTerm: 'user'
});

/**
 * Enterキーの処理
 */
const triggerEnter = (event:Event) => {
  //メッセージが空なら停止
  if (messageInput.value === "" || messageInput.value === " ") return;

  //console.log("/channel/:id :: triggerEnter : Enterメッセージ->", messageInput.value, event, props);
  socket.emit("sendMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    message: {
      channelId: props.channelInfo.channelId,
      content: messageInput.value
    }
  });
  
  //入力欄を初期化
  messageInput.value = "";
}
</script>

<template>
  <div>
    <v-text-field
      v-model="messageInput"
      @keydown.enter="triggerEnter"
      variant="solo-filled"
      rounded
    />
  </div>
</template>
