<script setup lang="ts">
import type role from '~/types/role';

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
    ここでロール管理
    {{ props.roleEditing }}

    <p>ロール名</p>
    <v-text-field v-model="roleEditingClone.name" />

  </div>
</template>
