# weather-view

天气查询演示项目：Vite 前端 + Express 后端，数据来自 [Open-Meteo](https://open-meteo.com/)。

## 环境要求

- Node.js 18+
- npm

## 快速启动

需要**同时**启动后端与前端（两个终端）。

### 1. 后端（端口 3001）

```bash
cd server
cp .env.example .env   # 可选，默认 PORT=3001
npm install
npm start
```

健康检查：

```bash
curl http://localhost:3001/health
```

天气 API 示例：

```bash
curl "http://localhost:3001/api/weather?city=北京"
```

### 2. 前端（端口 5173）

```bash
cd client
npm install
npm run dev
```

浏览器打开：**http://localhost:5173**

开发环境下，前端通过 Vite 将 `/api` 代理到 `http://localhost:3001`，无需额外配置 CORS。

## 目录结构

```
weather-view/
├── client/          # Vite + 原生 HTML/CSS/JS
│   ├── src/
│   │   ├── main.js
│   │   ├── api.js
│   │   └── ui.js
│   └── styles/
├── server/          # Express API
└── README.md
```

## 验收自测

1. 后端、前端均已启动
2. 在页面输入「北京」「Shanghai」可看到温度、湿度、风速等
3. 输入不存在城市（如 `xyznotacity`）显示错误提示
4. 浏览器控制台无报错

## 生产构建（可选）

```bash
cd client && npm run build && npm run preview
```

预览默认端口以 Vite 输出为准；生产部署需自行配置 API 反向代理。
