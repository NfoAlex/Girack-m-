<script setup lang="ts">
import type role from '~/types/role';

/**
 * prop
 */
const props = defineProps<{
  roleEditing: role
}>();

/**
 * data
 */
const roleEditingClone = ref<role>({ //編集用のロールデータ
  roleId: '',
  name: '',
  ServerManage: false,
  RoleManage: false,
  ChannelRename: false,
  ChannelViewPrivate: false,
  ChannelCreateAndDelete: false,
  UserManage: false,
  MessageDelete: false,
  MessageAttatchFile: false
});

/**
 * watch
 */
//propのロールデータの変更監視
watch(props, () => {
  //編集用ロール変数へロール情報をクローン
  roleEditingClone.value = structuredClone(toRaw(props.roleEditing));

  console.log("roleManager :: watch(roleEditing) : ", roleEditingClone.value);
});
</script>

<template>
  <div style="overflow-y: auto;">

    <m-card>
      <p>ロール名</p>
      <v-text-field v-model="roleEditingClone.name" />

      <v-divider class="my-2" />

      <v-checkbox v-model="roleEditingClone.ServerManage" label="サーバー情報の管理" />

      <v-divider class="my-2" />

      <v-checkbox v-model="roleEditingClone.RoleManage" label="ロール管理" />

      <v-divider class="my-2" />

      <p>チャンネル管理</p>
      <v-checkbox v-model="roleEditingClone.ChannelCreateAndDelete" label="チャンネルの作成、削除" />
      <v-checkbox v-model="roleEditingClone.ChannelRename" label="チャンネル名の編集" />
      <v-checkbox v-model="roleEditingClone.ChannelViewPrivate" label="プライベートチャンネルの閲覧、参加" />

      <v-divider class="my-2" />

      <v-checkbox v-model="roleEditingClone.UserManage" :hide-details="true" label="ユーザーの管理" />

      <v-divider class="my-2" />

      <p>メッセージの管理</p>
      <v-checkbox v-model="roleEditingClone.MessageDelete" label="メッセージの削除" />
      <v-checkbox v-model="roleEditingClone.MessageDelete" label="メッセージへのファイル添付" />

    </m-card>

  </div>
</template>
