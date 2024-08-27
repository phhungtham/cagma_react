process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const proxies = [
  {
    pathPattern: '/',
    proxy: {
      target: 'https://gmcadev.shinhanglobal.com',
      secure: false,
      changeOrigin: true,
      onProxyRes: (proxyRes, req, res) => {},
      onProxyReq: (proxyReq, req, res) => {},
    },
  },
];
const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use('/health-check', (req, res) => res.json({ message: 'Proxy started already !!!' }));
(function () {
  proxies.forEach(item => app.use(item.pathPattern, createProxyMiddleware(item.proxy)));
})();
const PORT = 4000;
app.listen(PORT, () => {});
