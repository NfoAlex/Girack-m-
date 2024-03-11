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
  color: '',
  ServerManage: false,
  RoleManage: false,
  ChannelRename: false,
  ChannelViewPrivate: false,
  ChannelCreateAndDelete: false,
  UserManage: false,
  MessageDelete: false,
  MessageAttatchFile: false
});
const stateEdited = ref<boolean>(false); //編集済み

/**
 * ロールデータを復元
 */
const restoreRoleData = () => {
  roleEditingClone.value = structuredClone(toRaw(props.roleEditing));
  //編集状態を解除
  stateEdited.value = false;

  //ロール編集データの監視しなおす
  watch(roleEditingClone.value, () => {
    //console.log("roleManager :: restoreRoleData : データ変わったな");
    if (JSON.stringify(roleEditingClone.value) === JSON.stringify(props.roleEditing)) {
      stateEdited.value = false;
    } else {
      stateEdited.value = true;
    }
  });
}

/**
 * watch
 */
//propのロールデータの変更監視
watch(props, () => {
  //編集用ロール変数へロール情報をクローン
  roleEditingClone.value = structuredClone(toRaw(props.roleEditing));

  //ロール編集データの監視
  watch(roleEditingClone.value, () => {
    //console.log("roleManager :: watch(roleEditingClone) : データ変わったな");
    if (JSON.stringify(roleEditingClone.value) === JSON.stringify(props.roleEditing)) {
      stateEdited.value = false;
    } else {
      stateEdited.value = true;
    }
  });

  //propが変わったら一旦編集状態を解除
  stateEdited.value = false;

  //console.log("roleManager :: watch(roleEditing) : ", roleEditingClone.value);
});
</script>

<template>
  <div style="overflow-y:auto;">

    <m-card>
      <p class="mb-1">ロール名</p>
      <v-text-field v-model="roleEditingClone.name" />
      <p class="mb-1">ロールの色</p>
      <v-color-picker
        v-model="roleEditingClone.color"
        width="100%"
      />

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

    <div v-if="stateEdited" class="my-3 mx-auto" style="position:sticky; bottom:10px; width:75%;">
      <m-card color="surface" class="d-flex flex-row justify-center">
        <m-btn
          class="mx-1"
          color="success"
        >
          変更を適用
        </m-btn>
        <m-btn
          @click="restoreRoleData"
          variant="text" 
          class="mx-1"
        >
          元に戻す
        </m-btn>
      </m-card>
    </div>

  </div>
</template>
