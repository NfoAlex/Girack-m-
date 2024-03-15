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
//ユーザーリスト用のページ数
const lengthPage = ref<number>(1);

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
 * ユーザーリストを取得
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

  //ユーザー数を30で割って必要なページ数を計算
  if (userCount.value / 30 > 1) {
    //それに設定
    lengthPage.value = userCount.value / 30;
    //もし30での除算で1以上いればもう1ページ追加
    if (userCount.value % 30 >= 1) lengthPage.value++;
  }
}

/**
 * ユーザー情報を受信したらそのユーザー分データを更新
 * @param dat
 */
const SOCKETfetchUserInfo = (dat:{result:string, data:MyUserinfo}) => {
  console.log("/users :: SOCKETfetchUserInfo : dat->", dat);

  //ユーザー格納用変数に該当するユーザーIDがあれば更新する
  if (users.value[dat.data.userId] !== undefined) {
    users.value[dat.data.userId] = dat.data;
  }
}

onMounted(() => {
  socket.on("RESULT::fetchUserAll", SOCKETfetchUserAll);
  socket.on("RESULT::fetchUserInfo", SOCKETfetchUserInfo);

  fetchUsers(1);
});

onUnmounted(() => {
  socket.off("RESULT::fetchUserAll", SOCKETfetchUserAll);
  socket.off("RESULT::fetchUserInfo", SOCKETfetchUserInfo);
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
      <p class="mb-2">ユーザー数 : {{ userCount }}</p>
      <v-table
        hover
        style="overflow-y:auto;"
        class="flex-grow-1"
      >
        <thead style="position:sticky; top:0px; z-index:1; background-color:rgb(var(--v-theme-surface))">
          <tr>
            <th class="text-left">
              ユーザー名
            </th>
            <th class="text-left">
              ロール
            </th>
            <th class="text-left">
              BAN状態
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
              <RoleChip
                v-for="roleId of user.role"
                :roleId="roleId"
              />
            </td>
            <td>
              {{ user.banned }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-pagination
        v-model="currentPage"
        :length="lengthPage"
        rounded="xl"
        class="mt-2"
      />
    </m-card>
  </div>
</template>
