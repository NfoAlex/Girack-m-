import { useAppStatus } from "~/stores/AppStatus";

export default defineNuxtRouteMiddleware((to) => {
	const nuxtApp = useNuxtApp();
	if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
		return;

	//ログインが済んでいないなら認証画面へ飛ばす
	const { getAppStatus } = storeToRefs(useAppStatus());
	if (
		to.path !== "/auth" &&
		!to.path.startsWith("/file/") &&
		!getAppStatus.value.profile.authDone
	)
		return navigateTo("/auth");
});
