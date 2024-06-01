<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

import type { channel } from '~/types/channel';
import type role from '~/types/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const roleSearchedData = ref<role[]>([]); //ロール検索結果格納用
const tempSpeakableRole = ref<string[]>([]);

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
 * ロール検索データ受け取り
 * @param dat
 */
const SOCKETsearchRole = (dat:{result:string, data:role[]}) => {
  //成功なら検索結果を格納
  if (dat.result === "SUCCESS") {
    roleSearchedData.value = [...roleSearchedData.value, ...dat.data];
    console.log("roleSearchedData->", roleSearchedData.value);
  }
};

onMounted(() => {
  //propsからの値を適用
  tempSpeakableRole.value = props.speakableRole;

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
})
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
      <v-chip class="d-flex align-center">
        <v-icon
          icon="mdi-circle"
          size="xs"
          class="mr-2"
          :color="item.props.color"
        />
        <span>{{ item.title }}</span>
      </v-chip>
    </template>

    <!-- ロール検索ボックス -->
    <template v-slot:['prepend-item']>
      <v-text-field
        density="compact"
        class="mx-3 my-2"
        variant="outlined"
        label="ロール名で検索"
        hide-details
        prepend-inner-icon="mdi-text-box-search-outline"
      />
    </template>

    <!-- ロール表示 -->
    <template v-slot:item="{item, index, props}">
      <v-card
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
