<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { channel } from '~/types/channel';
import { MyUserinfo } from '~/types/user';

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
const userAtHere = ref<MyUserinfo[]>([]); //チャンネルに参加する人リスト

/**
 * 入力テキストの監視
 */
watch(messageInput, (() => {
  //console.log("/channel/[id] :: watch(messageInput) : 入力検知->", messageInput.value);

  //検索モードを有効化する
  if (
    messageInput.value[messageInput.value.length - 1]
      ===
    "@"
  ) {
    //検索を有効化
    searchData.value.searching = true;
    //どの位置から始まっているか
    searchData.value.searchStartingAt = messageInput.value.length - 1;
    console.log("/channel/[id] :: watch(messageInput) : 検索モードON");

    //このチャンネルに参加するユーザーを取得
    socket.emit("searchUserInfo", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      userName: "", //全員取得するため空
      rule: "PARTIAL",
      channelId: props.channelInfo.channelId
    });
  }

  //スペースが入力された、あるいは文字が空になったら検索モードを終了
  if (
    messageInput.value[messageInput.value.length - 1] === " " ||
    messageInput.value[messageInput.value.length - 1] === "　" ||
    messageInput.value.length === 0
  ) {
    searchData.value.searching = false;
    console.log("/channel/[id] :: watch(messageInput) : 検索モードOFF");
  }

  //検索モードに入っているなら検索する
  if (searchData.value.searching) {
    //検索文字列の範囲終わりを取得
    searchData.value.searchEndingAt =
      messageInput.value.length -
      searchData.value.txtLengthWhenStartSearching +
      searchData.value.searchStartingAt;
    //もし開始文字位置と検索範囲終わり位置がかたよったら検索モードを無効化して関数を止める
    if (
      searchData.value.searchStartingAt + 1 >
      searchData.value.searchEndingAt
    ) {
      searchData.value.searching = false;
      return;
    }

    //検索文字列を取得
    searchData.value.query = messageInput.value.substring(
      searchData.value.searchStartingAt + 1,
      searchData.value.searchEndingAt
    );
    console.log("/channel/[id] :: watch(messageInput) : 検索クエリー->", searchData.value.query);
  }
}));

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

/**
 * ユーザーデータ受け取り
 * @param dat
 */
const SOCKETsearchUserInfo = (
  dat: {
    result: string,
    data: MyUserinfo[]
  }
) => {
  console.log("/channel/[id] :: SOCKETsearchUserInfo : dat->", dat);
  userAtHere.value = dat.data;
}

onMounted(() => {
  socket.on("RESULT::searchUserInfo", SOCKETsearchUserInfo);
});

onUnmounted(() => {
  socket.off("RESULT::searchUserInfo", SOCKETsearchUserInfo);
})
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
