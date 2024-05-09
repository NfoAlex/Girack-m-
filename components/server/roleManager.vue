<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type role from '~/types/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

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
const displayDeleteConfirm = ref<boolean>(false); //削除確認ダイアログ
const choosingColor = ref<boolean>(false); //カラーピッカー表示

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
 * ロールデータの更新
 */
const updateRole = () => {
  socket.emit("updateRole", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    roleData: roleEditingClone.value
  });
}

/**
 * ロールの削除
 */
const deleteRole = () => {
  //削除
  socket.emit("deleteRole", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    roleId: roleEditingClone.value.roleId
  });
  //ロールリストの再取得
  socket.emit("fetchRoles", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
  //削除ダイアログの非表示
  displayDeleteConfirm.value = false;
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


/**
 * ロール更新結果の受け取り
 * @param dat
 */
const SOCKETupdateRole = (dat:{result:string, dat:null}) => {
  console.log("roleManager :: SOCKETupdateRole : dat->", dat);
  //現在のロール情報を取得する
  socket.emit("fetchRoles", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

onMounted(() => {
  socket.on("RESULT::updateRole", SOCKETupdateRole);
});

onUnmounted(() => {
  socket.off("RESULT::updateRole", SOCKETupdateRole);
});
</script>

<template>
  <v-dialog
    v-model="displayDeleteConfirm"
    style="max-width: 650px; width: 80vw"
  >
    <m-card>
      <v-card-title>
        削除の確認
      </v-card-title>
      <v-card-text>
        <p>次のロールを削除してよろしいですか？</p>
        <p class="text-center text-h5 pa-5">{{ roleEditingClone.name }}</p>
      </v-card-text>
      <v-card-action class="d-flex flex-row-reverse">
        <m-btn @click="deleteRole" color="error">削除する</m-btn>
      </v-card-action>
    </m-card>
  </v-dialog>

  <!-- ロール色の設定用 -->
  <Teleport
    v-if="choosingColor"
    to="#colorChoosingArea"
    style="z-index:999; height:fit-content; width:fit-content;"
  >
      <v-color-picker
        v-model="roleEditingClone.color"
        v-click-outside="() => {if(choosingColor) choosingColor = false}"
        width="40%"
        max-width="300px"
        position="absolute"
        style="top:0px; z-index:999;"
        class="mx-auto mt-2 mb-5"
        hide-inputs
      />
  </Teleport>

  <div class="pb-5" style="overflow-y:auto;">

    <m-card>
      <v-alert
        v-if="
          roleEditingClone.roleId==='MEMBER'
            ||
          roleEditingClone.roleId==='HOST'
        "
        type="info"
        class="my-5"
      >
        MemberとHostロールは変更できません。
      </v-alert>

      <v-text-field
        v-model="roleEditingClone.name"
        label="ロール名"
        variant="outlined"
        prepend-inner-icon="mdi-tag"
        :error-messages="roleEditingClone.name.length > 32 ? 'ロール名は32文字までです。' : null"
      />

      <p class="mb-1">ロールの色</p>
      <span
        id="colorChoosingArea"
        class="d-flex align-center mb-5"
      >
        <m-btn
          @click="choosingColor = true"
          size="small"
          icon="mdi-eyedropper-variant"
        />
        <v-divider vertical class="mx-3" />
        <v-icon :color="roleEditingClone.color" class="mr-2">mdi-circle</v-icon>
        <p>{{ roleEditingClone.color }}</p>
      </span>

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
      <v-checkbox v-model="roleEditingClone.MessageDelete" label="他人のメッセージの削除" />
      <v-checkbox v-model="roleEditingClone.MessageAttatchFile" label="メッセージへのファイル添付" />

      <v-divider class="my-2" />

      <div class="mx-auto" style="width:fit-content">
        <m-btn
          @click="displayDeleteConfirm = true"
          :disabled="
            roleEditingClone.roleId==='MEMBER'
              ||
            roleEditingClone.roleId==='HOST'
          "
          color="error"
          class="my-2"
        >
          {{ roleEditing.name }}を削除
        </m-btn>
      </div>

    </m-card>

    <div v-if="stateEdited" class="my-3 mx-auto" style="position:sticky; bottom:10px; width:fit-content;">
      <m-card color="surface" class="d-flex flex-row justify-center">
        <m-btn
          @click="updateRole"
          :disabled="roleEditingClone.name.length > 32"
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
