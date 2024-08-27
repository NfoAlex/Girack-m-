<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import type { channel } from "~/types/channel";
import type { file } from "~/types/file";
import type { MyUserinfo } from "~/types/user";
import FileInputsDisplay from "./Input/FileInputsDisplay.vue";
import RemoteFileSelect from "./Input/RemoteFileSelect.vue";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel;
}>();

//メンションデータ用interface
interface ISearchData {
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

const allFileReady = ref<boolean>(true);
const fileData = ref<
  {
    fileId: string;
    fileBuffer: File | null;
    fileInfo: file | null;
    uploadedFrom: "remote" | "local";
    ready: boolean;
  }[]
>([]);

const elInput = ref<Element | null>(null); //入力欄要素を取得するためのref
const elFileInput = ref(null); //ファイル入力要素を取得するためのref
const inputRowNum = ref<number>(1); //入力欄の行数
const displayData = ref<boolean>(false);
const searchData = ref<ISearchData>({
  //検索データ
  query: "",
  searching: false,
  selectedIndex: 0,
  searchStartingAt: 0,
  searchEndingAt: 0,
  txtLengthWhenStartSearching: 0,
  searchingTerm: "user",
});
const searchDataResultUser = ref<MyUserinfo[]>([]);
const searchDataResultChannel = ref<channel[]>([]);
const userAtHere = ref<MyUserinfo[]>([]); //チャンネルに参加する人リスト

const displayRemoteFileSelect = ref<boolean>(false);

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
      searchData.value.searchEndingAt,
    );
    //console.log("/channel/[id] :: watch(messageInput) : 検索クエリー->", searchData.value.query);

    //ユーザー検索だった時に検索結果をフィルターするように
    if (searchData.value.searchingTerm === "user") {
      //クエリーでユーザーリストへフィルターかけて結果格納
      searchDataResultUser.value = userAtHere.value.filter((user) =>
        user.userName
          .toLocaleLowerCase()
          .includes(searchData.value.query.toLocaleLowerCase()),
      );
    }

    //２文字以上で、かつ検索するのがチャンネルなら検索
    if (
      searchData.value.searchingTerm === "channel" &&
      searchData.value.query.length >= 2
    ) {
      console.log(
        "Input :: watch(messageInput) : チャンネル検索する予定->",
        searchData.value.query,
      );

      //チャンネルを検索
      socket.emit("searchChannelInfo", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value,
        },
        query: searchData.value.query,
        pageIndex: 1,
      });
    }
  }
});

/**
 * ここで話せるかどうか
 */
const canISpeakHere = computed((): boolean => {
  //もし配列が空なら話せると設定
  if (props.channelInfo.speakableRole.length === 0) return true;

  //自分のロールに話せるロールが含まれるか調べてboolで結果を返す
  for (const role of props.channelInfo.speakableRole) {
    if (getMyUserinfo.value.role.includes(role)) return true;
    break;
  }

  return false;
});

/**
 * 入力欄からのペーストイベントの受け取り
 */
const receivePasteObject = async (event: ClipboardEvent) => {
  //入力受付
  const fileInputs = event.clipboardData?.files;

  //クリップボードの配列ループしてファイルが有効か調べてファイル用配列へ追加
  for (const index in fileInputs) {
    //console.log("Input :: receivePasteObject : index->", fileInputs[parseInt(index)]);
    try {
      //有効か？
      if (fileInputs[Number.parseInt(index)] !== undefined) {
        //ファイルの準備状況をfalseへ
        allFileReady.value = false;
        //ファイル入力用配列へ追加
        fileData.value.push({
          fileId: "",
          fileBuffer: fileInputs[Number.parseInt(index)],
          fileInfo: null,
          uploadedFrom: "local",
          ready: false,
        });
      }
    } catch (e) {}
  }
};

/**
 * ファイルの入力を受け取る
 */
const fileInputDirectly = () => {
  if (elFileInput.value === null) return;

  /*
  console.log("filePortal :: fileInput : ファイルデータ->",
    elFileInput.value.files[0].size < 1,
    elFileInput.value.files[0].size === undefined
  );
  */

  //inputに入力されたファイルの数ぶん処理する
  for (const index in elFileInput.value.files) {
    //条件を調べる
    if (
      elFileInput.value.files[index].size < 1 ||
      elFileInput.value.files[index].size === undefined
    ) {
      console.log("filePortal :: fileInput : ファイル入力エラー");
    } else {
      //ファイルの準備状況をfalseへ
      allFileReady.value = false;
      fileData.value.push({
        fileId: "",
        fileBuffer: elFileInput.value.files[index],
        fileInfo: null,
        uploadedFrom: "local",
        ready: false,
      });
    }
  }
};

/**
 * ファイルデータの更新、あとすべてのファイルが送信できる状態か調べる
 * @param file
 */
const updateFileDataValue = (
  fileNew: {
    fileId: string;
    fileBuffer: File | null;
    fileInfo: file | null;
    uploadedFrom: "remote" | "local";
    ready: boolean;
  },
  index: number,
) => {
  //格納
  fileData.value[index] = fileNew;

  //console.log("Input :: updateFileData : fileData今->", fileData.value, " もらった値->", fileNew);

  //ループしてファイルがいけるかどうか調べる
  for (const file of fileData.value) {
    if (!file.ready) return;
  }
  //ループを抜け出せたら準備完了と設定
  allFileReady.value = true;
};

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

    //現在の入力欄上のカーソル位置
    const currentTxtCursor: number = elInput.value.selectionStart;

    //テキストを現在のカーソル位置をもとに分裂させる
    const txtBefore = messageInput.value.slice(0, currentTxtCursor);
    const txtAfter = messageInput.value.slice(currentTxtCursor);

    //改行を挿入
    messageInput.value = `${txtBefore}\n${txtAfter}`;

    //カーソル位置を改行のすぐ次へ移動
    nextTick(() => {
      elInput.value.setSelectionRange(
        currentTxtCursor + 1,
        currentTxtCursor + 1,
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
    if (searchData.value.searchingTerm === "user") {
      insertResult(
        searchDataResultUser.value[searchData.value.selectedIndex].userId,
      );
    }
    if (searchData.value.searchingTerm === "channel") {
      insertResult(
        searchDataResultChannel.value[searchData.value.selectedIndex].channelId,
      );
    }
    //改行防止
    event.preventDefault();
    //選択インデックス初期化
    searchData.value.selectedIndex = 0;
    return;
  }

  //もし全ファイルが準備できていないなら止める
  if (!allFileReady.value) return;
  //ファイルIdを抽出して配列にする
  const fileIdArr = [];
  for (const file of fileData.value) {
    fileIdArr.push(file.fileId);
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
      fileId: fileIdArr,
    },
  });

  //ファイルデータを初期化
  fileData.value = [];
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

  //ユーザーを検索すると設定
  searchData.value.searchingTerm = "user";
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
 * #キーの入力
 */
const HashSignTrigger = () => {
  //ユーザーを検索すると設定
  searchData.value.searchingTerm = "channel";
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
  console.log("Input :: triggerDown : 下押された(検索中でない)->", searchData.value.selectedIndex);
  //検索しているカテゴリに応じて参照する配列を選択
  const targetArr = searchData.value.searchingTerm==='user' ? searchDataResultUser.value : searchDataResultChannel.value;
  //下キーの処理
  if (
    targetArr.length > searchData.value.selectedIndex + 1 && //Indexを足すときにまだ結果配列長より下なら
    searchData.value.searching
  ) {
    console.log("Input :: triggerDown : 下押された処理された");
    e.preventDefault();
    searchData.value.selectedIndex++;
  }
};

/**
 * メンション、あるいはチャンネルデータ(未実装)を挿入する
 * @param targetId
 */
const insertResult = (targetId: string) => {
  //検索しているカテゴリ別に#か@でクエリが始まっているかを調べる
  const searchingString =
    searchData.value.searchingTerm === "channel" ? "#" : "@";

  //入力テキストの@か#部分をメンション文で代入
  if (searchData.value.query === "") {
    const messageResult =
      // biome-ignore lint/style/useTemplate: Biomeが${}を使わせようとするけどそれだと無駄な改行が入る
      messageInput.value.substring(0, searchData.value.searchStartingAt) +
      `${searchingString}<${targetId}>` +
      messageInput.value.substring(searchData.value.searchStartingAt + 1);

    //console.log("Input :: insertResult : 挿入しようとしている文字列->", messageResult);

    messageInput.value = messageResult;
  } else {
    messageInput.value = messageInput.value.replace(
      `${searchingString}${searchData.value.query}`,
      `${searchingString}<${targetId}> `,
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
  searchDataResultUser.value = dat.data;
};

/**
 * チャンネルの検索結果受け取り
 * @dat
 */
const SOCKETsearchChannelInfo = (dat: { result: string; data: channel[] }) => {
  console.log("Input :: SOCKETsearchChannelInfo : データ->", dat);

  //成功ならデータ格納
  if (dat.result === "SUCCESS") {
    searchDataResultChannel.value = dat.data;
  }
};

onMounted(() => {
  socket.on("RESULT::searchUserInfo", SOCKETsearchUserInfo);
  socket.on("RESULT::searchChannelInfo", SOCKETsearchChannelInfo);
});

onUnmounted(() => {
  socket.off("RESULT::searchUserInfo", SOCKETsearchUserInfo);
  socket.off("RESULT::searchChannelInfo", SOCKETsearchChannelInfo);
});
</script>

<template>

  <!-- クラウドからのファイル選択 -->
  <v-dialog
    v-if="displayRemoteFileSelect"
    v-model="displayRemoteFileSelect"
    width="95vw"
    max-width="1200px"
    height="80vh"
  >
    <RemoteFileSelect
      @applySelectedFile="
        (fileSelected) => {
          fileData = [...fileData, ...fileSelected];
          displayRemoteFileSelect = false;
        }
      "
    />
  </v-dialog>

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
      <v-virtual-scroll
        v-if="searchData.searchingTerm==='user'"
        height="100%"
        :items="searchDataResultUser"
      >
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

      <!-- 結果ラベル表示 -->
      <span v-if="searchData.searchingTerm==='channel' && searchData.query.length < 2">
        <p class="text-center text-disabled mx-2 my-2">２文字以上を入力して検索</p>
      </span>
      <span v-if="searchData.searchingTerm==='channel' && searchDataResultChannel.length === 0">
        <p class="text-center mx-2 my-2">結果が空です...</p>
      </span>
      <v-virtual-scroll
        v-if="searchData.searchingTerm==='channel'"
        height="100%"
        :items="searchDataResultChannel"
      >
        <template v-slot:default="{ item, index }">
          <span
            @click="insertResult(item.channelId)"
            class="d-flex align-center px-2 py-1 cursor-pointer rounded-pill"
            v-ripple
            :style="
              'background-color:' +
              (index === searchData.selectedIndex
                ? 'rgba(var(--v-theme-primary), 0.3)'
                : '')
            "
          >
            <v-icon size="small">mdi-pound</v-icon>
            <p>{{ item.channelName }}</p>
          </span>
        </template>
      </v-virtual-scroll>
    </m-card>

    <m-card-compact color="surface" class="">
      <!-- 情報、ボタン表示用 -->
      <div v-if="displayData || fileData.length>=1" class="px-3 pt-4">
        <div>
          <!-- 添付ファイル表示用 -->
          <FileInputsDisplay
            :fileData
            :channelId="props.channelInfo.channelId"
            @trimFile="(index)=>{ fileData.splice(index,1) }"
            @updateFileData="args=>{ updateFileDataValue(args.fileData, args.index)}"
          />
        </div>
        <v-divider class="mx-auto mt-2" />
      </div>

      <v-textarea
        v-model="messageInput"
        id="elInput"
        @keydown.enter.prevent="triggerEnter"
        @keydown.up="triggerUp"
        @keydown.down="triggerDown"
        @keydown.@="AtsignTrigger"
        @keydown.#="HashSignTrigger"
        @paste="receivePasteObject"
        variant="solo"
        rows="1"
        maxRows="5"
        ref="elInput"
        no-resize
        autoGrow
        autofocus
        rounded
        hide-details
        :disabled="!canISpeakHere"
        :placeholder="
          canISpeakHere
            ? props.channelInfo.channelName + ' へ送信'
            : 'このチャンネルで話せません。'
        "
      >

      <!-- アップロードボタン -->
        <template v-slot:prepend-inner>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-plus"
                size="small"
              >
              </v-btn>
            </template>
            <v-list rounded="xl">
              <v-list-item
                key="uploadDirectly"
              >
                <m-btn
                  @click="displayRemoteFileSelect = true"
                >
                  <v-icon class="mr-1">mdi-cloud-download</v-icon>
                  クラウドから選択
                </m-btn>
              </v-list-item>
              <v-list-item
                key="uploadDirectly"
              >
                <m-btn
                  @click="elFileInput?.click()"
                >
                  <v-icon class="mr-1">mdi-upload</v-icon>
                  直接アップロード
                </m-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

      </v-textarea>
    </m-card-compact>

    <!-- ファイル受け取り部分(非表示) -->
    <input
      @change="fileInputDirectly"
      type="file"
      id="elFileInput"
      ref="elFileInput"
      style="display: none"
      multiple
    />
  </div>
  
</template>
