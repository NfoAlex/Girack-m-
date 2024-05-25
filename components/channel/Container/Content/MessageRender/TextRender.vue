<script setup lang="ts">
import type { VNode } from 'vue';
import { defineComponent, h } from 'vue'
import URLChip from './TextRender/URLChip.vue';

const URLRegex:RegExp = /((https|http)?:\/\/[^\s]+)/g;
const MentionRegex:RegExp = /@<([0-9]*)>/g;

const URLMatched = ref<RegExpMatchArray|null>(null);
const MentionMatched = ref<RegExpMatchArray|null>(null);

/**
 * data
 */
const MessageRenderingFinal = ref<VNode[]>([]);
const VNodeRenderingIndex = ref<{
  [key: string]: {
    type: "userId"|"link",
    data: string
  }
}>({});

//props
const props = defineProps<{
  content: string
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
          h("span", ObjectIndex[index].context)
        );
      }
    }

  }
}

/**
 * 検知したURL用のRegexを作る
 */
const createRegex = ():RegExp|null => {
  //URL抽出したもの
  let UrlMatchedArr = props.content.match(URLRegex);
  //Regexにする文字列格納用変数
  let URLFilteringRegex = "";
  //URLがnullならnullで返す
  if (UrlMatchedArr === null) return null;

  //console.log("createRegex :: UrlMatched->", UrlMatchedArr.length - 1);

  for (let index in UrlMatchedArr) {
    //Regexに追加する用URLの変数
    let urlUsing = "";
    //httpかhttpsかでRegex用にURL文字列を改変
    if (UrlMatchedArr[index].indexOf("https") !== -1) {
      urlUsing = UrlMatchedArr[index].replace("https://", "https:\\/\\/");
    } else {
      UrlMatchedArr[index].replace("http://", "http:\\/\\/");
    }

    //改変したものをRegexにするための文を前後に追加
    URLFilteringRegex += "(?:" + urlUsing + ")";

    //最後のURLじゃないなら"|"を追加
    if (parseInt(index) !== UrlMatchedArr.length-1) {
      URLFilteringRegex += "|";
    }
  }

  //Regex化して返す
  return new RegExp(URLFilteringRegex);
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
