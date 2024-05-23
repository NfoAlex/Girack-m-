import { defineEventHandler } from 'h3';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Nuxt configで登録したAPI_URLを設定
const API_URL = `ws://localhost:33333`;
// オプション
const myProxyOption = {
  target: API_URL,
  changeOrigin: true,
  ws: true,
  //logger: console,
  //pathFilter: apiPaths,
  cache: {
    // キャッシュの有効期限（ミリ秒単位）
    maxAge: 60000, // 1分
    // キャッシュの最大サイズ（バイト単位）
    maxSize: 1024 * 1024, // 1MB
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
  },
};

const myProxy = createProxyMiddleware(myProxyOption);

export default defineEventHandler(async (event) => {
  const url = event.node.req.url;
  // APIパスが複数ある場合
  const apiPaths:string[] = [
    '/socket.io',
    '/icon',
    '/uploadProfileIcon'
  ];
  
  // APIのパスと指定したもの以外は処理を止める止めないと他のパスに影響が出る
  const isContained = typeof url === 'string' && apiPaths.some((apiPath: string) => new RegExp(`^${apiPath}([/?]|$)`).test(url));
  if (!isContained) {
    return;
  }
  
  //ここでプロキシ適用
  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err) {
        console.log("PROXY :: エラー->", err);
        reject(err);
      } else {
        resolve(true);
      }
    }

    try {
      myProxy(event.req, event.res, next);
    } catch(e) {
      console.log("PROXY :: エラー->", e);
      reject(e);
    }
  })
});

