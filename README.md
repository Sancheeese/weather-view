# weather-view

天气展示全栈示例：Express 后端代理 Open-Meteo，Vite 前端展示实时天气。

## 项目结构

```
weather-view/
├── server/    # Node.js Express API（端口 3001）
├── client/    # Vite 静态前端（端口 5173）
└── README.md
```

## 环境要求

- Node.js 18+

## 快速启动

### 1. 启动后端

```bash
cd server
npm install
npm start
```

后端默认监听 **http://localhost:3001**

验证：

```bash
curl http://localhost:3001/health
curl --get "http://localhost:3001/api/weather" --data-urlencode "city=北京"
```

### 2. 启动前端

新开一个终端：

```bash
cd client
npm install
npm run dev
```

前端开发服务器：**http://localhost:5173**

开发环境下，`/api` 请求会通过 Vite 代理转发到 `http://localhost:3001`。

## 使用说明

1. 在浏览器打开 http://localhost:5173
2. 输入城市名（支持中文如「北京」或英文如「Shanghai」）
3. 点击「查询」或按回车，查看温度、湿度、风速与天气描述

## API 契约

`GET /api/weather?city={城市名}`

成功响应示例：

```json
{
  "ok": true,
  "data": {
    "city": "Beijing",
    "country": "China",
    "temperature": 18.5,
    "humidity": 45,
    "windSpeed": 12.3,
    "weatherDescription": "Mainly clear",
    "fetchedAt": "2026-05-18T12:00:00.000Z"
  }
}
```

## 生产构建（可选）

```bash
cd client && npm run build && npm run preview
```
