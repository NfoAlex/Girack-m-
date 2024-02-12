import { defineEventHandler } from 'h3';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineEventHandler(async (event) => {
  const url = event.node.req.url
  // APIパスが複数ある場合
  //const apiPaths = ['/api',]
  // APIのパスと指定したもの以外は処理を止める止めないと他のパスに影響が出る
  //const isContained = typeof url === 'string' && apiPaths.some((apiPath: string) => new RegExp(`^${apiPath}([/?]|$)`).test(url))
  
  //const config = useRuntimeConfig()
  // Nuxt configで登録したAPI_URLを設定
  //const API_URL = `${config.API_URL}`
  const myProxy = createProxyMiddleware({
    target: "ws://localhost:33333",
    changeOrigin: true,
    ws: true,
    logger: console,
    pathFilter: "/socket.io"
  })
  await new Promise((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    }

    myProxy(event.req, event.res, next)
  })
})