<script setup lang="ts">
import { useConfig } from '~/stores/config';
import { useHistory } from '~/stores/history';
import { useInbox } from '~/stores/inbox';

const { getConfig, getConfigSyncStatus } = storeToRefs(useConfig());
const { getHasNewMessage } = storeToRefs(useHistory());
const { getInbox } = storeToRefs(useInbox());
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">JSON</p>

      <p>同期設定 - sync</p>
      <m-card>
        <code>
          {{ getConfigSyncStatus }}
        </code>
      </m-card>

      <p>通知設定部分 - notification</p>
      <m-card>
        <code>
          {{ getConfig.notification }}
        </code>
      </m-card>

      <p>通知設定部分 - notification</p>
      <m-card>
        <code>
          {{ getConfig.theme }}
        </code>
      </m-card>

      <p class="mt-3">チャンネル表示設定 - channel</p>
      <m-card>
        <code>
          {{ getConfig.channel }}
        </code>
      </m-card>

      <p class="mt-3">サイドバー表示設定 - sidebar</p>
      <m-card>
        <code>
          {{ getConfig.sidebar }}
        </code>
      </m-card>

      <p class="mt-3">新着の状態 - history</p>
      <m-card>
        <code>
          {{ getHasNewMessage }}
        </code>
      </m-card>

      <p class="mt-3">メンション数(random) - inbox</p>
      <m-card>
        <code>
          {{ getInbox }}
        </code>
      </m-card>
    </NuxtLayout>
  </div>
</template>
