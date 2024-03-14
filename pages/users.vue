<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { MyUserinfo } from '~/types/user';

/**
 * data
 */
const userCount = ref<number>(0);
const users = ref<
  {
    [key:string]: MyUserinfo
  }
>({});

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
}

onMounted(() => {
  socket.on("RESULT::fetchUserAll", SOCKETfetchUserAll);

  //ユーザーを取得
  socket.emit("fetchUserAll", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    indexPage: 1
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchUserAll", SOCKETfetchUserAll);
});

</script>

<template>
  <div class="pa-4">
    <p class="text-h5 pa-2">ユーザーリスト</p>
    <v-divider class="my-2"></v-divider>
    <m-card class="mx-auto">
      ユーザー数 : {{ userCount }}
      <v-divider class="my-2"></v-divider>
      <v-table>
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
            :key="index"
          >
            <td>{{ user.userName }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </v-table>
    </m-card>
  </div>
</template>
