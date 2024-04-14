<script setup lang="ts">
import { useUserIndex } from '~/stores/userindex';
import HoverMenu from './MessageRender/HoverMenu.vue';
import EmojiRender from './MessageRender/EmojiRender.vue';
import type message from '~/types/message';

const { getUserinfo } = useUserIndex();

const userIdForDialog = ref<string>("");
const displayUserpage = ref<boolean>(false);

const propsMessage = defineProps<{
  message: message,
  borderClass: string,
}>();

</script>

<template>
  <v-menu
    open-on-hover
    location="end"
    origin="end center"
    :close-on-content-click="false"
    close-delay="10"
    open-delay="10"
    transition="none"
  >
    <template v-slot:activator="{ props }">

      <div v-bind="props" class="d-flex pr-2" style="width:100%; height:100%;">

        <!-- アバター -->
        <span style="width:65px" class="px-1">
          <v-avatar
            @click="() => { 
              userIdForDialog = message.userId;
              displayUserpage = true;
            }"
            class="mr-2 cursor-pointer"
            v-show="
              propsMessage.borderClass==='messageSingle'
              ||
              propsMessage.borderClass==='messageTop'
            "
            size="45px"
          >
            <v-img :src="'/icon/' + message.userId" :alt="message.userId" />
          </v-avatar>
        </span>

        <div
          class="px-3 flex-grow-1 d-flex flex-column flex-wrap messageContainer"
          :class="propsMessage.borderClass"
          style="width:calc(100% - 65px);"
        >
          <span
            v-if="
              propsMessage.borderClass==='messageSingle'
              ||
              propsMessage.borderClass==='messageTop'
            "
            class="d-flex align-center"
          >
            <p>{{ getUserinfo(message.userId).userName }}</p>
            <p class="text-medium-emphasis text-subtitle-2 ml-2">
              {{ new Date(message.time).toLocaleString() }}
            </p>
          </span>
          <p class="text-medium-emphasis" style="word-break: break-all;">
            {{ message.content }}
          </p>

          <!-- 絵文字表示 -->
          <EmojiRender :reaction="JSON.parse(message.reaction)" />

        </div>
      </div>
      
    </template>

    <!-- ホバーメニュー -->
    <HoverMenu :message="propsMessage.message" style="width:fit-content;" />

  </v-menu>
</template>

<style scoped>

.messageContainer {
  background-color: rgb(var(--v-theme-code));
  padding: 8px;
}

.messageContainer:hover {
  background-color: rgb(var(--v-theme-messageHovered));
}

.messageTop {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  margin-top: 4px;
}

.messageBottom {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;

  margin-Bottom: 4px;
}

.messageMiddle {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  padding: 2px;
  margin: 0;
}

.messageSingle {
  border-radius: 18px;

  margin: 4px 0;
}

</style>