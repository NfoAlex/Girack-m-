import { defineEventHandler } from 'h3';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineEventHandler(async (event) => {
  const url = event.node.req.url;
  // APIパスが複数ある場合
  const apiPaths = ['/socket.io','/img'];
  // APIのパスと指定したもの以外は処理を止める止めないと他のパスに影響が出る
  const isContained = typeof url === 'string' && apiPaths.some((apiPath: string) => new RegExp(`^${apiPath}([/?]|$)`).test(url));
  if (!isContained) {
    return;
  }

  // Nuxt configで登録したAPI_URLを設定
  const API_URL = `ws://localhost:33333`;
  const myProxy = createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    ws: true,
    logger: console,
    pathFilter: apiPaths
  });

  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    }

    myProxy(event.req, event.res, next);
  })
})