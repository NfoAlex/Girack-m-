<script setup lang="ts">
import type { VNode } from 'vue';
import { defineComponent, h } from 'vue'

const URLRegex:RegExp = /((https|http)?:\/\/[^\s]+)/g;
//let URLFilteringRegex:RegExp|string = "";
const URLMatched = ref<RegExpMatchArray|null>(null);

const MessageRenderingFinal = ref<VNode[]>([]);
const VNodeRenderingIndex = ref<{
  [key: string]: {
    type: "userId"|"link",
    data: string
  }
}>({});

const props = defineProps<{
  content: string
}>();

/**
 * メッセージをVNodeにパースしてレンダーできる形にする
 */
const parseVNode = () => {
  //URLを抽出
  URLMatched.value = props.content.match(URLRegex);
  //もしURLがnullじゃないならパース処理
  if (URLMatched.value !== null) {
    const URLFilteringRegex = createRegex();
    console.log("/channel/:id :: TextRender :: parseVNode : URLFilteringRegex->", URLFilteringRegex);
    if (URLFilteringRegex === null) return;

    for (let index in URLMatched.value) {
      console.log("URL->", URLMatched.value[index]);
      //レンダーするURL要素を追加
      VNodeRenderingIndex.value["Index" + index] = {
        type: "link",
        data: URLMatched.value[index]
      };
    }

    //メッセージ本文からsplitでこのURLを取り除いて格納
    const contentFiltered = props.content.split(URLFilteringRegex);

    console.log("/channel/:id :: TextRender :: watch(props) : contentFiltered->", contentFiltered);

    //URL抜いたcontent配列をループ、VNode化して格納
    for (let index in contentFiltered) {
      //普通の文字列追加
      MessageRenderingFinal.value.push(
        h(
          "span",
          null,
          contentFiltered[index]
        )
      );
      //もしURLがあるならそれもVNodeで追加
      if (VNodeRenderingIndex.value["Index"+index] !== undefined) {
        MessageRenderingFinal.value.push(
          h(
            "a",
            {href:VNodeRenderingIndex.value["Index"+index].data},
            VNodeRenderingIndex.value["Index"+index].data
          )
        );
      }
    }

    console.log("FINAL RESULT ->", MessageRenderingFinal.value);
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

  console.log("createRegex :: UrlMatched->", UrlMatchedArr.length - 1);

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
  return() {
    return (
      h(
        "span",
        MessageRenderingFinal.value
      )
    )
  }
});

//メッセージ本文の変更監視
watch(props, () => {
  //console.log("/channel/:id :: TextRender :: watch(props) : match->", props.content.match(URLRegex));
  parseVNode();
});

onMounted(() => {
  // /(?:https:\/\/youtube.com)|(?:https:\/\/tumblr.com)/
  parseVNode();
});
</script>

<template>
  <p class="text-medium-emphasis" style="word-break: break-all;">
    {{ props.content }}
    <span>ここからパースしたもの -- </span><ContentRenderParsed />
  </p>
</template>
