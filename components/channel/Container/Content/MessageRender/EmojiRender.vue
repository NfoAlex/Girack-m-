<script setup lang="ts">
import data from "emoji-mart-vue-fast/data/twitter.json";
import { EmojiIndex } from "emoji-mart-vue-fast/src"; //TS...
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";

// biome-ignore lint/suspicious/noExplicitAny: emoji-mart-vue-fast用のタイプが存在しないため
let emojiIndex: any; //絵文字データ用(onMountedでロードする)

//Socket通信のユーザー情報用
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//props(リアクション)
const props = defineProps<{
  channelId: string;
  messageId: string;
  reaction: {
    [key: string]: {
      [key: string]: number;
    };
  };
}>();

//リアクションデータがあるなら絵文字データをロード、格納する
if (JSON.stringify(props.reaction) !== "{}") {
  //console.log("EmojiReader :: reaction->", props.reaction);
  //console.log("EmojiReader :: data->", data);
  emojiIndex = new EmojiIndex(data);
}

//リアクションデータの変更を監視して絵文字データをロードするように
watch(props, () => {
  //初回のみね
  if (JSON.stringify(props.reaction) !== "{}" && emojiIndex === undefined) {
    emojiIndex = new EmojiIndex(data);
  }
});

/**
 * 絵文字のレンダー
 */
const emojiRender = (emojiId: string) => {
  //総リアクション数
  let totalReactionNumber = 0;
  try {
    //リアクション数を加算
    for (const reactionedUserId in props.reaction[emojiId]) {
      totalReactionNumber += props.reaction[emojiId][reactionedUserId];
    }
    //絵文字と合わせて総数を文字列として返す
    return emojiIndex._emojis[emojiId].native + totalReactionNumber.toString();
  } catch (e) {
    console.log("EmojiReader :: onMounted : e->", e);
  }
};

/**
 * 絵文字表示をクリックしたらそれに対してリアクション
 * @param emojiId
 */
const addMoreReaction = (emojiId: string) => {
  socket.emit("reactMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    channelId: props.channelId,
    messageId: props.messageId,
    reactionName: emojiId,
  });
};
</script>

<template>
  <span class="mt-1">
    <v-chip
      v-for="(reaction,key) of props.reaction"
      @click="addMoreReaction(key.toString())"
      style="
        margin-bottom: 4px;
        margin-top: 2px;
        margin-right: 4px;
        user-select: none;
        -webkit-user-select: none;
      "
      :key="key"
    >
      {{ emojiRender(key.toString()) }}
    </v-chip>
  </span>
</template>
