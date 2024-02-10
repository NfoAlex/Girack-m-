<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="pa-4">
    <p class="text-h5 pa-2">あなた</p>
    <v-divider class="my-2"></v-divider>
    <m-card class="mx-auto" width="80%">

      <div class="d-flex justify-start" style="width:100%;">

        <!-- アイコン -->
        <div>
          <v-img
            @click=""
            :alt="getMyUserinfo.userid"
            :src="'http://localhost:33333/img/file.jpeg'"
            width="100"
          ></v-img>
        </div>

        <!-- ユーザー名 -->
        <div class="d-flex flex-column justify-center align-self-stretch px-4" style="width:100%;">
          <p class="text-disabled text-h6">
            ID : {{ getMyUserinfo.userid }}
          </p>
          <div class="d-flex align-center align-self-stretch">
            <p class="text-h4 text-truncate me-auto">
              {{ getMyUserinfo.username }}
            </p>
            <v-btn rounded="lg" icon="" variant="text">
              <v-icon>mdi:mdi-pencil</v-icon>
            </v-btn>
          </div>
        </div>

      </div>

      <v-divider class="my-3"></v-divider>
      
      <p>
        <m-btn color="red">ログアウトする</m-btn>
      </p>

    </m-card>
    
  </div>
</template>