<script setup lang="ts">
import { defineComponent, h, computed } from "vue";
import ChannelChip from "./TextRender/ChannelChip.vue";
import URLChip from "./TextRender/URLChip.vue";
import UserChip from "./TextRender/UserChip.vue";

const URLRegex: RegExp = /((https|http)?:\/\/[^\s]+)/g;
const MentionRegex: RegExp = /@<([0-9]*)>/g;
const BrRegex: RegExp = /\n/g;
const ChannelRegex: RegExp = /#<([0-9]*)>/g;

const props = defineProps<{
  content: string;
}>();

const parseVNode = computed(() => {
  //レンダーする要素用データ
  const ObjectIndex: {
    context: string;
    type: "link" | "userId" | "breakLine" | "channel";
    index: number;
  }[] = [];

  //メッセージ本文からRegexを使い要素データとテキストデータを分けて順番に追加する関数
  const addMatches = (regex: RegExp, type: "link" | "userId" | "breakLine" | "channel") => {
    let match;
    let contentClone = props.content;
    let offset = 0;
    while ((match = regex.exec(contentClone)) !== null) {
      ObjectIndex.push({
        context: match[0],
        type: type,
        index: match.index + offset
      });
      offset += match.index + match[0].length;
      contentClone = contentClone.slice(match.index + match[0].length);
      regex.lastIndex = 0;
    }
  };

  //ここでメッセージ本文から抜き出し処理
  addMatches(URLRegex, "link");
  addMatches(MentionRegex, "userId");
  addMatches(BrRegex, "breakLine");
  addMatches(ChannelRegex, "channel");

  ObjectIndex.sort((a, b) => a.index - b.index);

  const content: string[] = [];
  let lastIndex = 0;
  for (const obj of ObjectIndex) {
    content.push(props.content.slice(lastIndex, obj.index));
    lastIndex = obj.index + obj.context.length;
  }
  content.push(props.content.slice(lastIndex));

  //// ここからVNodeへパース ////

  //結果保存用配列
  const MessageRenderingFinal:VNode[] = [];
  //レンダーする要素配列をループしてVNodeへパース
  for (let i = 0; i < content.length; i++) {
    //まず最初のデータをパースする
    MessageRenderingFinal.push(h("span", content[i]));
    if (i < ObjectIndex.length) {
      const obj = ObjectIndex[i];
      switch (obj.type) {
        case "link":
          MessageRenderingFinal.push(h(URLChip, { url: obj.context }));
          break;
        case "userId":
          MessageRenderingFinal.push(h(UserChip, { userId: obj.context }));
          break;
        case "breakLine":
          MessageRenderingFinal.push(h("br"));
          break;
        case "channel":
          MessageRenderingFinal.push(h(ChannelChip, { channelId: obj.context }));
          break;
      }
    }
  }

  return MessageRenderingFinal;
});

const ContentRenderParsed = defineComponent({
  setup() {
    return () => parseVNode.value;
  },
});
</script>

<template>
  <span class="text-medium-emphasis" style="word-break:normal;">
    <ContentRenderParsed />
  </span>
</template>