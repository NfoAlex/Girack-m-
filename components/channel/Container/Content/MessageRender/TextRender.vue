<script setup lang="ts">
import type { VNode } from 'vue';
import { defineComponent, h } from 'vue'
import URLChip from './TextRender/URLChip.vue';
import UserChip from './TextRender/UserChip.vue';

const URLRegex:RegExp = /((https|http)?:\/\/[^\s]+)/g;
const MentionRegex:RegExp = /@<([0-9]*)>/g;

const URLMatched = ref<RegExpMatchArray|null>(null);
const MentionMatched = ref<RegExpMatchArray|null>(null);

/**
 * data
 */
const MessageRenderingFinal = ref<VNode[]>([]); //最終レンダーに使うVNode用配列

//props
const props = defineProps<{
  content: string //メッセージ本文
}>();

/**
 * メッセージをVNodeにパースしてレンダーできる形にする
 */
const parseVNode = () => {
  //それぞれの要素の位置と種類を記録する要素データ配列
  const ObjectIndex:{
    context: string, //内容(URLあるいはユーザーId)
    type: "link"|"userId", //要素がリンク用かメンション用か
    index: number //メッセ上の位置
  }[] = [];

  //メッセからURLを抽出
  URLMatched.value = props.content.match(URLRegex);
  //メッセからメンションを抽出
  MentionMatched.value = props.content.match(MentionRegex);

  //URLがnullじゃなければindexを取得して格納
  if (URLMatched.value !== null) {
    for (let url of URLMatched.value) {
      ObjectIndex.push({
        context: url,
        type: "link",
        index: props.content.indexOf(url)
      });
    }
  }
  //userId(メンション用)がnullじゃなければindexを取得して格納
  if (MentionMatched.value !== null) {
    for (let userId of MentionMatched.value) {
      ObjectIndex.push({
        context: userId,
        type: "userId",
        index: props.content.indexOf(userId)
      });
    }
  }

  //要素データ配列をindexでソートする
  ObjectIndex = ObjectIndex.sort((obj1,obj2) => obj1.index>obj2.index);

  //メッセージ本文を分ける配列
  let content:string[] = [props.content];
  //要素データ配列をループしてメッセージから排除した状態で配列にする
  for (let j of ObjectIndex) {
    content = content.join("").split(j.context);
  }

  //ループして最終レンダー用配列へVNodeを格納
  for (let index in content) {

    //最初に本文追加
    MessageRenderingFinal.value.push(
      h(
        "span",
        content[index]
      )
    );

    //そしてそのindexに存在するならタイプに合わせて要素データ配列から追加
    if (ObjectIndex[index] !== undefined) {
      //リンク
      if (ObjectIndex[index].type === "link") {
        MessageRenderingFinal.value.push(
          h(URLChip, {url: ObjectIndex[index].context})
        );
      }
      //メンション
      if (ObjectIndex[index].type === "userId") {
        MessageRenderingFinal.value.push(
          h(UserChip, {userId:ObjectIndex[index].context})
        );
      }
    }

  }
}

/**
 * 最終的にパースして作ったVNodeをコンポーネント化した部分
 */
const ContentRenderParsed = defineComponent({
  setup() {
    return () => MessageRenderingFinal.value
  }
});

//メッセージ本文の変更検知したときもパース処理する
watch(props, () => {
  parseVNode();
});

onMounted(() => {
  parseVNode();
});
</script>

<template>
  <p class="text-medium-emphasis" style="word-break: break-all;">
    <ContentRenderParsed />
  </p>
</template>
