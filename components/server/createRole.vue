<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "../../stores/userinfo";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * emit
 */
const emit = defineEmits(["closeDialog"]);

/**
 * data
 */
//チャンネル作成用に使うデータ
const roleCreationData = ref<{ name: string; color: string }>({
	name: "",
	color: "",
});
const roleCreationError = ref<boolean>(false);

/**
 * チャンネルを作成する
 */
const createRole = () => {
	socket.emit("createRole", {
		RequestSender: {
			userId: getMyUserinfo.value.userId,
			sessionId: getSessionId.value,
		},
		roleData: {
			name: roleCreationData.value.name,
			color: roleCreationData.value.color,
		},
	});
};

/**
 * ダイアログ閉じる処理
 */
const closeDialog = () => {
	//ダイアログを閉じさせる
	emit("closeDialog");
	//ロール作成用変数を初期化
	nextTick(() => {
		roleCreationData.value = { name: "", color: "" };
		roleCreationError.value = false;
	});
};

/**
 * チャンネル作成結果受け取り
 * @param dat
 */
const SOCKETcreateRole = (dat: { result: string; data: boolean | null }) => {
	console.log("createRole :: SOCKETcreateRole : dat->", dat);
	//結果に応じて表示を変更
	if (dat.result !== "SUCCESS") {
		//エラー表示
		roleCreationError.value = true;
	} else {
		//更新させるためにチャンネルリストを取得する
		//ロールの取得
		socket.emit("fetchRoles", {
			RequestSender: {
				userId: getMyUserinfo.value.userId,
				sessionId: getSessionId.value,
			},
		});
		//ダイアログを閉じる
		closeDialog();
	}
};

onMounted(() => {
	socket.on("RESULT::createRole", SOCKETcreateRole);
	//チャンネル作成結果を初期化
	roleCreationError.value = false;
	roleCreationData.value = { name: "", color: "" };
});

onUnmounted(() => {
	socket.off("RESULT::createRole", SOCKETcreateRole);
});
</script>

<template>
  <v-dialog
    style="max-width: 750px; width: 85vw"
  >
    <m-card>
      <v-card-title>
        ロールの作成
      </v-card-title>

      <v-card-text>
        <p>プレビュー :</p>
        <div class="mx-auto mt-5" style="width:fit-content">
          <v-chip  size="large" >
            <v-icon :color="roleCreationData.color" class="mr-2">mdi-circle</v-icon>
            <p>
              {{
              roleCreationData.name.length !==0 
                ?
                  roleCreationData.name
                :
                  'ロール'
              }}
            </p>
          </v-chip>
        </div>

        <v-divider class="my-5" />

        <v-text-field
          v-model="roleCreationData.name"
          class="my-2"
          label="ロール名"
          variant="outlined"
          prepend-inner-icon="mdi-tag"
        />
        <p class="text-disabled mb-1">ロールの色</p>
        <v-color-picker
          v-model="roleCreationData.color"
          width="100%"
        />

        <!-- 作成エラー -->
        <v-alert
          v-if="roleCreationError"
          type="error"
          class="mt-5"
        >
          内部エラー。後でもう一度試してください。
        </v-alert>
        <!-- 文字数エラー -->
        <v-alert
          v-if="roleCreationData.name.length > 32"
          type="error"
          class="mt-5"
        >
          ロール名は32文字までです。(現在{{ roleCreationData.name.length }}文字)
        </v-alert>
      </v-card-text>

      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="createRole()"
          color="primary"
          :disabled="roleCreationData.name.length>32 || roleCreationData.name.length===0"
        >
          作成!
        </m-btn>
      </v-card-actions>
      
    </m-card>
  </v-dialog>
</template>
