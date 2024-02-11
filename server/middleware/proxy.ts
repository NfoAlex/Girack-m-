import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'ws://localhost:33333', // 例: 'http://localhost:3001'
  changeOrigin: true,
  ws: true, // WebSocketを有効にする
  logLevel: 'debug', // ログレベルを指定（必要に応じて）
  // 他の必要な設定をここに追加...
});