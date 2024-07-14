<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import type { channel } from "~/types/channel";
import type { MyUserinfo } from "~/types/user";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel;
}>();

//メンションデータ用interface
interface SearchData {
  query: string; //検索文字列
  searching: boolean; //検索モードに入っているかどうか
  selectedIndex: number; //選択しているもの
  searchStartingAt: number; //検索モードに入った文字位置
  searchEndingAt: number; //検索文字列の範囲終わり(文字列全体の長さ - searchStartingAt)
  txtLengthWhenStartSearching: number; //検索をし始めたときの文字列全体の長さ
  searchingTerm: "user" | "channel"; //ToDo::(!現在未使用!)検索するもの("user" | "channel")
}

/**
 * data
 */
const messageInput = ref<string>(""); //メッセージ入力用変数
const elInput = ref(null); //入力欄要素を取得するためのref
const inputRowNum = ref<number>(1); //入力欄の行数
const searchData = ref<SearchData>({
  //検索データ
  query: "",
  searching: false,
  selectedIndex: 0,
  searchStartingAt: 0,
  searchEndingAt: 0,
  txtLengthWhenStartSearching: 0,
  searchingTerm: "user",
});
const searchDataResult = ref<MyUserinfo[]>([]);
const userAtHere = ref<MyUserinfo[]>([]); //チャンネルに参加する人リスト

/**
 * 入力テキストの監視
 */
watch(messageInput, () => {
  //console.log("/channel/[id] :: watch(messageInput) : 入力検知->", messageInput.value);

  //スペースが入力された、あるいは文字が空になったら検索モードを終了
  if (
    messageInput.value[messageInput.value.length - 1] === " " ||
    messageInput.value[messageInput.value.length - 1] === "　" ||
    messageInput.value.length === 0
  ) {
    searchData.value.searching = false;
    //console.log("/channel/[id] :: watch(messageInput) : 検索モードOFF");
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
    //console.log("/channel/[id] :: watch(messageInput) : 検索クエリー->", searchData.value.query);

    //クエリーでユーザーリストへフィルターかけて結果格納
    searchDataResult.value = userAtHere.value.filter((user) =>
      user.userName
        .toLocaleLowerCase()
        .includes(searchData.value.query.toLocaleLowerCase())
    );
  }
});

/**
 * ここで話せるかどうか
 */
const canISpeakHere = computed((): boolean => {
  //もし配列が空なら話せると設定
  if (props.channelInfo.speakableRole.length === 0) return true;

  //自分のロールに話せるロールが含まれるか調べてboolで結果を返す
  for (let role of props.channelInfo.speakableRole) {
    console.log("/channel/[id] :: Input :: canISpeakHere : forロール->", role);
    if (getMyUserinfo.value.role.includes(role)) return true;
    break;
  }

  return false;
});

/**
 * Enterキー入力の処理
 */
const triggerEnter = (event: KeyboardEvent) => {
  //MacのIME入力中はEnterを無視
  // 229はMacのIME入力中のキーコードです非推奨ですが、現状これで対応しています
  if (
    navigator.userAgent.toUpperCase().indexOf("MAC") >= 0 &&
    event.keyCode === 229
  ) {
    return;
  }

  //Shiftキーを押されているならシンプルに改行
  if (event.shiftKey) {
    //もし要素が取得できなかったら停止
    if (elInput.value === null) return;

    //console.log("/channel/[id] :: Input : 要素->", elInput.value.selectionStart);

    //現在の入力欄上のカーソル位置
    const currentTxtCursor: number = elInput.value.selectionStart;

    //テキストを現在のカーソル位置をもとに分裂させる
    let txtBefore = messageInput.value.slice(0, currentTxtCursor);
    let txtAfter = messageInput.value.slice(currentTxtCursor);

    //改行を挿入
    messageInput.value = txtBefore + "\n" + txtAfter;

    //カーソル位置を改行のすぐ次へ移動
    nextTick(() => {
      elInput.value.setSelectionRange(
        currentTxtCursor + 1,
        currentTxtCursor + 1
      );
    });
    //関数終了
    return;
  }

  //メッセージが空なら停止
  if (messageInput.value === "" || messageInput.value === " ") return;

  //検索中なら指定のユーザーIdあるいはチャンネルIdを挿入
  if (searchData.value.searching) {
    //検索位置の終わり取得
    searchData.value.searchEndingAt =
      messageInput.value.length -
      searchData.value.txtLengthWhenStartSearching -
      searchData.value.searchStartingAt;

    if (
      searchData.value.searchStartingAt + 1 >
      searchData.value.searchEndingAt
    ) {
      searchData.value.searching = false;
    }

    //挿入
    insertResult(searchDataResult.value[searchData.value.selectedIndex].userId);
    //改行防止
    event.preventDefault();
    //選択インデックス初期化
    searchData.value.selectedIndex = 0;
    return;
  }

  //console.log("/channel/:id :: triggerEnter : Enterメッセージ->", messageInput.value, event, props);
  socket.emit("sendMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    message: {
      channelId: props.channelInfo.channelId,
      content: messageInput.value,
    },
  });

  //入力欄を初期化
  messageInput.value = "";
  inputRowNum.value = 1;
};

/**
 * @ キーの入力の処理
 */
const AtsignTrigger = () => {
  console.log("Input :: AtsignTrigger : @キー押された");

  //このチャンネルに参加するユーザーを取得
  socket.emit("searchUserInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    userName: "", //全員取得するため空
    rule: "PARTIAL",
    channelId: props.channelInfo.channelId,
  });

  //検索モードを有効化
  searchData.value.searching = true;
  //この時の文章の長さを格納
  searchData.value.txtLengthWhenStartSearching = messageInput.value.length;
  //選択を初期化
  searchData.value.selectedIndex = 0;
  //入力の開始位置を格納
  searchData.value.searchStartingAt = elInput.value.selectionStart;
};

/**
 * 上キーによる検索結果上の選択カーソル移動
 * @param e
 */
const triggerUp = (e: Event) => {
  //上キーの処理
  if (
    0 <= searchData.value.selectedIndex - 1 && //Indexを引くときに0以上なら
    searchData.value.searching
  ) {
    e.preventDefault();
    searchData.value.selectedIndex--;
  }
};

/**
 * 下キーによる検索結果上の選択カーソル移動
 * @param e
 */
const triggerDown = (e: Event) => {
  //下キーの処理
  if (
    searchDataResult.value.length > searchData.value.selectedIndex + 1 && //Indexを足すときにまだ結果配列長より下なら
    searchData.value.searching
  ) {
    e.preventDefault();
    searchData.value.selectedIndex++;
  }
};

/**
 * メンション、あるいはチャンネルデータ(未実装)を挿入する
 * @param targetId
 */
const insertResult = (targetId: string) => {
  //入力テキストの@部分をメンション文で代入
  if (searchData.value.query === "") {
    messageInput.value =
      messageInput.value.substring(0, searchData.value.searchStartingAt) +
      ("@<" + targetId + "> ") +
      messageInput.value.substring(searchData.value.searchStartingAt + 1);
  } else {
    messageInput.value = messageInput.value.replace(
      "@" + searchData.value.query,
      "@<" + targetId + "> "
    );
  }

  //検索モードを終了する
  searchData.value.searching = false;
};

/**
 * ユーザーデータ受け取り
 * @param dat
 */
const SOCKETsearchUserInfo = (dat: { result: string; data: MyUserinfo[] }) => {
  console.log("/channel/[id] :: SOCKETsearchUserInfo : dat->", dat);
  //ユーザーリストを格納
  userAtHere.value = dat.data;
  //初期結果にも格納する
  searchDataResult.value = dat.data;
};

onMounted(() => {
  socket.on("RESULT::searchUserInfo", SOCKETsearchUserInfo);
});

onUnmounted(() => {
  socket.off("RESULT::searchUserInfo", SOCKETsearchUserInfo);
});
</script>

<template>
  <div style="height: fit-content">
    <!-- メンションウィンドウ -->
    <m-card
      v-if="searchData.searching"
      position="relative"
      style="
        bottom: 0%;
        z-index: 999999;
        overflow-y: auto;
        padding: 8px 4px !important;
      "
      maxHeight="30vh"
      rounded="xl"
      width="100%"
      color="messageHovered"
    >
      <v-virtual-scroll height="100%" :items="searchDataResult">
        <template v-slot:default="{ item, index }">
          <span
            @click="insertResult(item.userId)"
            class="d-flex align-center px-1 py-1 cursor-pointer rounded-pill"
            v-ripple
            :style="
              'background-color:' +
              (index === searchData.selectedIndex
                ? 'rgba(var(--v-theme-primary), 0.3)'
                : '')
            "
          >
            <v-avatar class="mr-3" :size="28">
              <v-img :alt="item.userId" :src="'/icon/' + item.userId"></v-img>
            </v-avatar>
            <p>{{ item.userName }}</p>
          </span>
        </template>
      </v-virtual-scroll>
    </m-card>
    <v-textarea
      v-model="messageInput"
      id="elInput"
      @keydown.enter.prevent="triggerEnter"
      @keydown.up="triggerUp"
      @keydown.down="triggerDown"
      @keydown.@="AtsignTrigger"
      variant="solo-filled"
      rows="1"
      maxRows="5"
      ref="elInput"
      no-resize
      autoGrow
      autofocus
      rounded
      :disabled="!canISpeakHere"
      :placeholder="
        canISpeakHere
          ? props.channelInfo.channelName + ' へ送信'
          : 'このチャンネルで話せません。'
      "
    />
  </div>
</template>
