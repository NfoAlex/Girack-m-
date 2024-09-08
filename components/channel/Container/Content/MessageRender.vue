<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useInbox } from "~/stores/inbox";
import { useMessageReadTime } from "~/stores/messageReadTime";
import { useUserIndex } from "~/stores/userindex";
import { useMyUserinfo } from "~/stores/userinfo";
import type message from "~/types/message";
import ContentEditing from "./MessageRender/ContentEditing.vue";
import EmojiRender from "./MessageRender/EmojiRender.vue";
import FileDataPreview from "./MessageRender/FileDataPreview.vue";
import HoverMenu from "./MessageRender/HoverMenu.vue";
import LinkPreview from "./MessageRender/LinkPreview.vue";
import TextRender from "./MessageRender/TextRender.vue";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getUserinfo } = useUserIndex();
const { getMessageReadTimeBefore } = storeToRefs(useMessageReadTime());
const { getInbox } = storeToRefs(useInbox());

/**
 * data
 */
const userIdForDialog = ref<string>("");
const displayUserpage = ref<boolean>(false);
const stateEditingMessage = ref<boolean>(false);
const displayHoverMenu = ref<boolean>(false);

const emits = defineEmits<(e: "leaveEditingParent") => void>();

const propsMessage = defineProps<{
  message: message;
  index: number;
  editThisMessage: boolean;
  borderClass: string;
}>();

//このメッセージが通知Inboxにあるかどうかを調べてその通知を消す
onMounted(() => {
  if (getInbox.value.mention[propsMessage.message.channelId] !== undefined) {
    if (
      getInbox.value.mention[propsMessage.message.channelId].indexOf(
        propsMessage.message.messageId,
      ) !== -1
    ) {
      socket.emit("removeFromUserInbox", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value,
        },
        inboxCategory: "mention",
        channelId: propsMessage.message.channelId,
        inboxItemId: propsMessage.message.messageId,
      });
    }
  }
});
</script>

<template>
  <!-- ユーザーページ -->
  <Userinfo
    v-model="displayUserpage"
    v-if="displayUserpage"
    :userId="userIdForDialog"
  />
  
  <!--
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

      
      
    </template>
  </v-menu>
  -->

  <div
    @mouseover="displayHoverMenu=true"
    @mouseleave="displayHoverMenu=false"
    class="d-flex pr-2"
    style="width:100%; height:100%; position:relative;"
  >

    <!-- ホバーメニュー -->
    <HoverMenu
      v-if="displayHoverMenu"
      @mouseleave.prevent="null"
      :message="propsMessage.message"
      @enter-editing="stateEditingMessage = true"
      style="width:fit-content; position:absolute; z-index:9999; right:0; bottom:90%;"
    />

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
        <p class="text-medium-emphasis text-caption ml-2">
          {{ new Date(message.time).toLocaleString() }}
        </p>
      </span>
      
      <!-- メッセージ文レンダーあるいは編集枠 -->
      <TextRender v-if="!stateEditingMessage && !propsMessage.editThisMessage" :content="message.content" />
      <ContentEditing
        v-else
        @leave-editing="stateEditingMessage=false; emits('leaveEditingParent');"
        :content="message.content"
        :channelId="message.channelId"
        :messageId="message.messageId"
      />

      <!-- メッセージが編集されたものだった時の表示 -->
      <span v-if="message.isEdited && !stateEditingMessage" class="text-disabled text-subtitle-2">編集済み</span>

      <!-- ファイル表示 -->
      <FileDataPreview v-if="message.fileId.length >= 1" :fileId="message.fileId" />

      <!-- リンクプレビューレンダー -->
      <LinkPreview :linkData="message.linkData" />

      <!-- 絵文字表示 -->
      <EmojiRender :channelId="message.channelId" :messageId="message.messageId" :reaction="message.reaction" />

    </div>
  </div>

  <!-- 新着メッセージ表示 -->
  <span
    v-if="
      (
        getMessageReadTimeBefore(propsMessage.message.channelId)
          ===
        propsMessage.message.time
      )
        &&
      propsMessage.index !== 0
    "
    class="d-flex align-center"
    style="margin-top:-10px; margin-bottom:-10px;"
  >
    <v-divider
      color="secondary"
    />
    <v-chip
      class="flex-shrink-0"
      size="x-small"
      color="secondary"
      variant="flat"
    >
      ここから新着
    </v-chip>
    <v-divider
      color="secondary"
    />
  </span>

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
