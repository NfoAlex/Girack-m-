<script setup lang="ts">
import { CalendarHeatmap } from "vue3-calendar-heatmap";
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
  <div>
    <v-row>
      <v-col cols="">
        <m-card class="mb-5">
          <div class="px-2 my-2 d-flex">
            <v-avatar size="70" class="mr-3 mx-2">
              <v-img
                :alt="getMyUserinfo.userId"
                :src="'/icon/' + getMyUserinfo.userId"
              ></v-img>
            </v-avatar>
            <div>
              <text class="algin-center ma-2 font-weight-black text-h5">
                {{ getMyUserinfo.userName }}
              </text>
              <div class="d-flex">
                <v-chip
                  v-for="role of getMyUserinfo.role"
                  :key="role"
                  class="mr-1"
                  size="small"
                  variant="flat"
                >
                  {{ role }}
                </v-chip>
              </div>
            </div>
          </div>

          <m-card variant="outlined">
            {{ getMyUserinfo }}
          </m-card>
          <!-- アクティブ状況を草で表示 -->
          <!-- https://razorness.github.io/vue3-calendar-heatmap/ -->
          <calendar-heatmap
            dark-mode
            class="mt-5 overflow-x-visible h-60"
            :values="[{ date: '2023-9-22', count: 16 }]"
            startDate="2023-9-1"
            endDate="2024-9-22"
            :round="5"
          />
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
