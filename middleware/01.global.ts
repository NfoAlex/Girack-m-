export default defineNuxtRouteMiddleware(to => {
  const nuxtApp = useNuxtApp();
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return;

  console.log("01.global(middle) :: ミドルウェアあ");

});