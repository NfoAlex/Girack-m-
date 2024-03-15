<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useRole } from '~/stores/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getRoleSingle } = storeToRefs(useRole());

import type { MyUserinfo } from '~/types/user';

/**
 * data
 */
//ロード中であるかどうか
const stateLoading = ref<boolean>(true);
//今いるページ
const currentPage = ref<number>(1);

//ユーザー数格納用
const userCount = ref<number>(0);
//ユーザー情報格納用
const users = ref<
  {
    [key:string]: MyUserinfo
  }
>({});
//ユーザーダイアログ表示用
const userIdForDialog = ref<string>(""); //表示するユーザーのID
const displayUserpage = ref<boolean>(false); //ダイアログ制御用

/**
 * ページの移動を監視してまたユーザーリストをフェッチ
 */
watch(currentPage, () => {
  fetchUsers(currentPage.value);
});

/**
 * 指定するページ部分にあたるユーザー取得(30人ごと)
 */
const fetchUsers = (page:number) => {
  //ユーザーを取得
  socket.emit("fetchUserAll", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    indexPage: page
  });
  //ロード中と設定
  stateLoading.value = true;
}

/**
 * ユーザーを取得
 * @param dat
 */
const SOCKETfetchUserAll = (dat:{
  result: string,
  data: {
    datUser: {
      [key: string]: MyUserinfo
    },
    countUser: number
  }
}) => {
  console.log("/users :: SOCKETfetchUserAll : dat->", dat);

  //ユーザー情報格納
  users.value = dat.data.datUser;
  userCount.value = dat.data.countUser;
  //ロード中状態を解除
  stateLoading.value = false;
}

onMounted(() => {
  socket.on("RESULT::fetchUserAll", SOCKETfetchUserAll);

  fetchUsers(1);
});

onUnmounted(() => {
  socket.off("RESULT::fetchUserAll", SOCKETfetchUserAll);
});

</script>

<template>
  <Userinfo
    v-model="displayUserpage"
    v-if="displayUserpage"
    :userId="userIdForDialog"
  />

  <div class="pa-4 mx-auto d-flex flex-column" style="max-width:1200px; height:100%;">
    <p class="text-h5 pa-2">ユーザーリスト</p>
    <v-divider class="my-2"></v-divider>
    <m-card class="mx-auto d-flex flex-column" :loading="stateLoading" style="width:100%; height:100%;">
      ユーザー数 : {{ userCount }}
      <v-divider class="my-2"></v-divider>
      <v-table
        hover
        style="overflow-y:auto;"
        class="flex-grow-1"
      >
        <thead>
          <tr>
            <th class="text-left">
              ユーザー名
            </th>
            <th class="text-left">
              ロール
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user,index) of users"
            @click="userIdForDialog=user.userId; displayUserpage=true;"
            :key="index"
          >
            <td>{{ user.userName }}</td>
            <td>
              <v-chip v-for="roleId of user.role">
                <v-icon
                  :color="getRoleSingle(roleId).color"
                  class="mr-2"
                >mdi-circle</v-icon>
                {{ getRoleSingle(roleId).name }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-pagination
        v-model="currentPage"
        :length="4"
        rounded="xl"
        class="mt-2"
      />
    </m-card>
  </div>
</template>
