<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useRole } from '~/stores/role';

import type { channel } from '~/types/channel';
import type role from '~/types/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getRoleSingle } = storeToRefs(useRole());

/**
 * data
 */
const roleSearchedData = ref<role[]>([]); //ロール検索結果格納用
const tempSpeakableRole = ref<string[]>([]); //編集用話せるロール配列
//ロール検索用クエリー保存データ
const roleSearchInput = ref<
  {query:string, querySearched:string, pageIndex:number, reachedEnd:boolean}
>({
  query: "", //検索クエリー用
  querySearched: "", //最後に結果を受け取った検索クエリー
  pageIndex: 1, //ロール検索結果のページ番号
  reachedEnd: false, //最後のページまで受け取ったかどうか
});

//prop
const props = defineProps<{
  channelId: string,
  channelInfo: channel,
  speakableRole: string[]
}>();

/**
 * チャンネル更新
 */
const updateChannel = () => {
  //チャンネル情報を取得
  socket.emit("updateChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelId,
    channelInfo: {
      ...props.channelInfo,
      speakableRole: tempSpeakableRole.value
    }
  });
};

/**
 * 検索クエリーでロールを検索する
 */
const searchRole = (pageIndex:number=1) => {
  //検索したクエリーと入力クエリーが一緒なら停止
  if (roleSearchInput.value.query === roleSearchInput.value.querySearched) return;

  //取得
  socket.emit("searchRole", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    searchQuery: roleSearchInput.value.query,
    pageIndex: pageIndex
  });

  //再検索なら最後の結果まで検索した状態を解除
  if (pageIndex === 1) {
    roleSearchInput.value.reachedEnd = false;
  }
  //検索したクエリー文を上書き
  roleSearchInput.value.querySearched = roleSearchInput.value.query;
};

/**
 * ロール検索データ受け取り
 * @param dat
 */
const SOCKETsearchRole = (dat:{result:string, data:{role:role[], pageIndex:number}}) => {
  //成功なら検索結果を格納
  if (dat.result === "SUCCESS") {
    if (dat.data.pageIndex === roleSearchInput.value.pageIndex + 1) {
      roleSearchedData.value = [...roleSearchedData.value, ...dat.data.role];
    } else {
      roleSearchedData.value = dat.data.role;
    }

    //どのページまで読み込んだかを保存
    roleSearchInput.value.pageIndex = dat.data.pageIndex;
    //結果が空なら最後のページまで行ったと設定
    if (dat.data.role.length === 0) roleSearchInput.value.reachedEnd = true;

    console.log("dat->", dat);
  }
};

onMounted(() => {
  //propsからの値を適用
  tempSpeakableRole.value = props.speakableRole;
  console.log("/channel/[id] :: SpeakableRoleSelect :: onMounted : props.speakableRole->", props.speakableRole);

  socket.on("RESULT::searchRole", SOCKETsearchRole);

  //取得
  socket.emit("searchRole", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    searchQuery: "",
    pageIndex: 1
  });
});

onUnmounted(() => {
  socket.off("RESULT::searchRole", SOCKETsearchRole);
});
</script>

<template>
  <v-select
    v-model="tempSpeakableRole"
    :items="roleSearchedData"
    :item-props="(item)=>{
      return {title:item.name, value:item.roleId, color:item.color}
    }"
    class="mr-3 mt-3"
    variant="outlined"
    label="話せるロール"
    multiple
    chips
    closable-chips
  >

    <template v-slot:chip="{item, index, props}">
      <v-chip
        @click:close="()=>{tempSpeakableRole.splice(index,1); updateChannel();}"
        class="d-flex align-center"
      >
        <v-icon
          icon="mdi-circle"
          size="xs"
          class="mr-2"
          :color="item.props.color"
        />
        <span>{{ getRoleSingle(item.props.value).name }}</span>
      </v-chip>
    </template>

    <!-- ロール検索ボックス -->
    <template v-slot:['prepend-item']>
      <v-text-field
        v-model="roleSearchInput.query"
        class="mx-3 my-2"
        variant="outlined"
        label="ロール名で検索"
        hint="空で検索すると全ロール検索"
        prepend-inner-icon="mdi-text-box-search-outline"
      >
        <template
          v-slot:['append-inner']
          v-if="roleSearchInput.query!==roleSearchInput.querySearched"
        >
          <v-btn @click="searchRole" icon="mdi-magnify" size="small"></v-btn>
        </template>
      </v-text-field>
    </template>

    <!-- ロール表示 -->
    <template v-slot:item="{item, index, props}">
      <v-card
        v-if="!tempSpeakableRole.includes(props.value)"
        @click="()=>{tempSpeakableRole.push(props.value); updateChannel();}"
        class="my-1 mx-2 pa-2 rounded-pill d-flex align-center"
      >
        <v-icon
          icon="mdi-circle"
          size="xs"
          class="mr-2"
          :color="roleSearchedData[index].color"
        />
        <span>{{ roleSearchedData[index].name }}</span>
      </v-card>
    </template>

  </v-select>
</template>
