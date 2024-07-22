<script setup lang="ts">
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getInbox } = storeToRefs(useInbox());

const route = useRoute();
</script>

<template>
  <!-- 新規登録ユーザー用 -->
  <Welcome v-if="route.query['firstTime']" v-model="route.query['firstTime']" />

  <div class="header pa-5">
    <h4 class="text-h4">
      {{ getServerinfo.servername }}
    </h4>
    <IndexOnlineUsers />
  </div>
  <div class="pa-5">
    <v-row>
      <v-col>
        <m-card class="mb-5">
          <div
            class="px-2 my-2"
            style="font-weight: 600"
            :style="{
              'background-image':
                'url(' + '/icon/' + getMyUserinfo.userId + ')',
            }"
          >
            <v-avatar size="86" class="mr-3 mx-2">
              <v-img
                :alt="getMyUserinfo.userId"
                :src="'/icon/' + getMyUserinfo.userId"
              ></v-img>
            </v-avatar>
            <text class="algin-center ma-2 font-weight-black text-h5">
              {{ getMyUserinfo.userName }}
            </text>
          </div>
          <p>piniaデータ :</p>
          <p>Serverinfo :</p>
          <m-card variant="outlined">
            {{ getServerinfo }}
          </m-card>
          <p>MyUserinfo :</p>
          <m-card variant="outlined">
            {{ getMyUserinfo }}
          </m-card>
          <p>セッションID :</p>
          <m-card variant="outlined">
            {{ getSessionId }}
          </m-card>
        </m-card>
      </v-col>
      <v-col>
        <m-card>
          <div class="text-h5 pa-2 border-b-lg" style="font-weight: 600">
            Notification
          </div>
          {{ getInbox }}
        </m-card>
      </v-col>
      <v-col>
        <m-card>
          <div class="text-h5 pa-2 border-b-lg" style="font-weight: 600">
            ここがホーム
          </div>
          <p>piniaデータ :</p>
          <p>Serverinfo :</p>
          <m-card variant="outlined">
            {{ getServerinfo }}
          </m-card>
          <p>MyUserinfo :</p>
          <m-card variant="outlined">
            {{ getMyUserinfo }}
          </m-card>
          <p>セッションID :</p>
          <m-card variant="outlined">
            {{ getSessionId }}
          </m-card>
        </m-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="css">
.header {
  border-radius: 28px 0 0 28px;
}
</style>
