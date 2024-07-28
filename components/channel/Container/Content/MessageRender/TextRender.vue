<script setup lang="ts">
import type { VNode } from "vue";
import { defineComponent, h } from "vue";
import URLChip from "./TextRender/URLChip.vue";
import UserChip from "./TextRender/UserChip.vue";

const URLRegex: RegExp = /((https|http)?:\/\/[^\s]+)/g;
const MentionRegex: RegExp = /@<([0-9]*)>/g;
const BrRegex: RegExp = /\n/g;

const URLMatched = ref<RegExpMatchArray | null>(null);
const MentionMatched = ref<RegExpMatchArray | null>(null);
const BrMatched = ref<RegExpMatchArray | null>(null);

/**
 * data
 */
const MessageRenderingFinal = ref<VNode[]>([]); //最終レンダーに使うVNode用配列

//props
const props = defineProps<{
	content: string; //メッセージ本文
}>();

/**
 * メッセージをVNodeにパースしてレンダーできる形にする
 */
const parseVNode = () => {
	//それぞれの要素の位置と種類を記録する要素データ配列
	const ObjectIndex: {
		context: string; //内容(URLあるいはユーザーId)
		type: "link" | "userId" | "breakLine"; //要素がリンク用かメンション用か改行用か
		index: number; //メッセ上の位置
	}[] = [];

	//メッセからURLを抽出
	URLMatched.value = props.content.match(URLRegex);
	//メッセからメンションを抽出
	MentionMatched.value = props.content.match(MentionRegex);
	//メッセから改行を抽出
	BrMatched.value = props.content.match(BrRegex);

	//URLがnullじゃなければindexを取得して格納
	if (URLMatched.value !== null) {
		//複数回の検索に対応させるために検索終えた文を排除するため、排除する文字の長さを貯める
		let removedLengthTotal = 0;
		let contentCloned = props.content;

		for (const url of URLMatched.value) {
			ObjectIndex.push({
				context: url,
				type: "link",
				index: contentCloned.indexOf(url) + removedLengthTotal,
			});

			//これから排除する文の長さを貯める
			removedLengthTotal += url.length;
			//メッセージからURLを排除
			contentCloned =
				contentCloned.slice(0, contentCloned.indexOf(url)) +
				contentCloned.slice(contentCloned.indexOf(url) + url.length);
		}
	}
	//userId(メンション用)がnullじゃなければindexを取得して格納
	if (MentionMatched.value !== null) {
		//複数回の検索に対応させるために検索終えた文を排除するため、排除する文字の長さを貯める
		let removedLengthTotal = 0;
		let contentCloned = props.content;

		for (const userId of MentionMatched.value) {
			ObjectIndex.push({
				context: userId,
				type: "userId",
				index: contentCloned.indexOf(userId) + removedLengthTotal,
			});

			//これから排除する文の長さを貯める
			removedLengthTotal += userId.length;
			//メッセージからuserIdを排除
			contentCloned =
				contentCloned.slice(0, contentCloned.indexOf(userId)) +
				contentCloned.slice(contentCloned.indexOf(userId) + userId.length);
		}
	}
	//<br>(改行用)がnullじゃなければindexを取得して格納
	if (BrMatched.value !== null) {
		//複数回の検索に対応させるために検索終えた文を排除するため、排除する文字の長さを貯める
		let removedLengthTotal = 0;
		let contentCloned = props.content;

		for (const br of BrMatched.value) {
			ObjectIndex.push({
				context: br,
				type: "breakLine",
				index: contentCloned.indexOf(br) + removedLengthTotal,
			});

			//これから排除する文の長さを貯める
			removedLengthTotal += br.length;
			//メッセージからuserIdを排除
			contentCloned =
				contentCloned.slice(0, contentCloned.indexOf(br)) +
				contentCloned.slice(contentCloned.indexOf(br) + br.length);
		}
	}

	//要素データ配列をindexでソートする
	ObjectIndex.sort((obj1, obj2) => obj1.index - obj2.index);

	//メッセージ本文からVNode用要素を抜いて配列化する
	let content: string[] = [props.content];
	for (const index in ObjectIndex) {
		//分裂用配列の最後の中での抜き出し文の位置
		const contextPositionNow = content[index].indexOf(
			ObjectIndex[index].context,
		);
		//抜き出す文の長さ
		const contextLength = ObjectIndex[index].context.length;

		//ここから抜き出し文のslice
		/**
		 * index = ループの番号
		 * 抜き出し文 = "<abc>"
		 * 現在のcontent = ["asdf<abc>1234<abc>"]
		 *
		 * 抜き出し文の位置 : 4 (contextPositionNow)
		 * 抜き出し文の長さ : 5 (contextLength)
		 *
		 * 左分の分裂:
		 * slice(0 , contextPositionNow)
		 * ↓
		 * slice(0, 4)
		 *   ↓---↓
		 * ["asdf<abc>1234<abc>"]
		 * 左分の結果 :: "asdf"
		 *
		 * 右分の分裂:
		 * slice(contextLength + contextPositionNow)
		 * ↓
		 * slice(9)
		 *            ↓--------
		 * ["asdf<abc>1234<abc>"]
		 * 右分の結果 :: "1234<abc>"
		 *
		 * !!!最初のループでは最初の""を追加しない!
		 * 最終結果 :: [...content.slice(0,parseInt(index)), 左分結果, 右分結果]
		 * ❌["", "asdf", "1234<abc>"]
		 * 🙆‍♂️["asdf", "1234<abc>"]
		 * !!!最初のループでは最初の""を追加しない!
		 *
		 * ↓ 例として次のループだと... (index = 1)
		 *
		 * 現content = ["asdf", "1234<abc>"]
		 * 現content[index] = "1234<abc>"
		 * 左 : slice(0, 4) -> "1234"
		 * 右 : slice(9) -> ""
		 * 最終結果 : [...["asdf", "1234<abc>"], "1234", ""]
		 */

		//抜き出し文で分裂させた左の部分
		const resultPartedLeft = content[index].slice(0, contextPositionNow);
		//抜き出し文で分裂させた右の部分
		const resultPartedRight = content[index].slice(
			contextLength + contextPositionNow,
		);

		//結果を結合、最初のループなら配列をマージせず、そのまま追加
		if (Number.parseInt(index) === 0) {
			content = [resultPartedLeft, resultPartedRight];
		} else {
			content = [
				...content.slice(0, Number.parseInt(index)),
				resultPartedLeft,
				resultPartedRight,
			];
		}
	}

	//ループして最終レンダー用配列へVNodeを格納
	for (const index in content) {
		//最初に本文追加
		MessageRenderingFinal.value.push(h("span", content[index]));

		//そしてそのindexに存在するならタイプに合わせて要素データ配列から追加
		if (ObjectIndex[index] !== undefined) {
			//リンク
			if (ObjectIndex[index].type === "link") {
				MessageRenderingFinal.value.push(
					h(URLChip, { url: ObjectIndex[index].context }),
				);
			}
			//メンション
			if (ObjectIndex[index].type === "userId") {
				MessageRenderingFinal.value.push(
					h(UserChip, { userId: ObjectIndex[index].context }),
				);
			}
			//改行
			if (ObjectIndex[index].type === "breakLine") {
				MessageRenderingFinal.value.push(h("br"));
			}
		}
	}
};

/**
 * 最終的にパースして作ったVNodeをコンポーネント化した部分
 */
const ContentRenderParsed = defineComponent({
	setup() {
		return () => MessageRenderingFinal.value;
	},
});

//メッセージ本文の変更検知したときもパース処理する
watch(props, () => {
	MessageRenderingFinal.value = [];
	parseVNode();
});

onMounted(() => {
	parseVNode();
});
</script>

<template>
  <span class="text-medium-emphasis" style="word-break: break-all;">
    <ContentRenderParsed />
  </span>
</template>
