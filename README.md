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
3. 点击「查询」或按回车，查看温度、湿度、风速、天气描述、生活建议（穿衣、出行、体感）与当地推荐景点

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
    "fetchedAt": "2026-05-18T12:00:00.000Z",
    "suggestions": [
      {
        "category": "clothing",
        "label": "穿衣",
        "tips": ["长袖衬衫或薄针织", "早晚备一件薄外套", "适合单层或两层穿搭"]
      },
      {
        "category": "travel",
        "label": "出行",
        "tips": ["天气较好，适合散步或短途出行"]
      },
      {
        "category": "comfort",
        "label": "体感",
        "tips": ["温湿度较舒适，保持日常作息即可"]
      }
    ],
    "attractions": [
      {
        "name": "故宫",
        "description": "明清皇家宫殿，世界文化遗产",
        "tags": ["历史", "地标"]
      },
      {
        "name": "天安门广场",
        "description": "首都中心广场，升旗仪式与国庆活动举办地",
        "tags": ["地标", "广场"]
      }
    ]
  }
}
```

生活建议由后端规则引擎根据温度、湿度、风速与天气代码生成（当前写死在代码中，后续可接入大模型）。

`attractions` 为按解析后城市名（`data.city`）返回的 3～5 条当地推荐景点；支持北京、上海、广州、深圳、杭州、成都、西安等常见中英文城市名，未知城市返回 `[]`。

## 生产构建（可选）

```bash
cd client && npm run build && npm run preview
```
123
8ab4a62f
456
