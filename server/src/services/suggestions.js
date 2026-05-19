/**
 * Rule-based lifestyle suggestions from current weather.
 * Hardcoded for now; can be replaced by an LLM later.
 */

const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const STORM_CODES = new Set([95, 96, 99]);
const FOG_CODES = new Set([45, 48]);

function clothingTips(temperature) {
  if (temperature < 0) {
    return ['厚羽绒服或棉大衣', '戴帽子、围巾和手套', '穿保暖裤与防滑靴'];
  }
  if (temperature < 10) {
    return ['棉衣或厚外套', '内搭毛衣或抓绒', '早晚可加一层'];
  }
  if (temperature < 18) {
    return ['薄外套或风衣', '长袖内搭即可', '体感偏凉时可加一件'];
  }
  if (temperature < 26) {
    return ['长袖衬衫或薄针织', '早晚备一件薄外套', '适合单层或两层穿搭'];
  }
  if (temperature < 32) {
    return ['短袖或透气长袖', '选择棉麻等透气面料', '户外注意防晒'];
  }
  return ['轻薄透气的夏装', '遮阳帽与防晒霜', '多补水，避免长时间暴晒'];
}

function travelTips({ weatherCode, windSpeed, temperature }) {
  const tips = [];

  if (STORM_CODES.has(weatherCode)) {
    tips.push('有雷暴，尽量避免户外活动');
    tips.push('远离树木、电线杆与开阔高地');
  } else if (RAIN_CODES.has(weatherCode)) {
    tips.push('有降水，出门请带伞');
    tips.push('路面可能湿滑，驾车减速慢行');
  } else if (SNOW_CODES.has(weatherCode)) {
    tips.push('有降雪，注意路面结冰');
    tips.push('穿防滑鞋，公共交通更稳妥');
  } else if (FOG_CODES.has(weatherCode)) {
    tips.push('能见度较低，驾车打开雾灯');
    tips.push('步行通过路口时多观察来车');
  } else if (weatherCode <= 1 && temperature >= 10 && temperature <= 28) {
    tips.push('天气较好，适合散步或短途出行');
  }

  if (windSpeed >= 40) {
    tips.push('风力较大，不建议骑行或高空作业');
  } else if (windSpeed >= 25) {
    tips.push('风偏大，户外注意防风保暖');
  }

  if (temperature >= 35) {
    tips.push('高温时段尽量减少户外暴晒');
  } else if (temperature <= -5) {
    tips.push('严寒天气，缩短户外停留时间');
  }

  if (tips.length === 0) {
    tips.push('天气平稳，按日常节奏出行即可');
  }

  return tips;
}

function comfortTips({ temperature, humidity }) {
  const tips = [];

  if (humidity >= 80 && temperature >= 24) {
    tips.push('闷热潮湿，注意通风与补水');
  } else if (humidity >= 70) {
    tips.push('湿度偏高，体感可能偏闷');
  } else if (humidity <= 30) {
    tips.push('空气干燥，多喝水并使用保湿');
  }

  if (temperature >= 30) {
    tips.push('天气炎热，避免剧烈运动');
  } else if (temperature <= 5) {
    tips.push('气温较低，注意手脚保暖');
  }

  if (tips.length === 0) {
    tips.push('温湿度较舒适，保持日常作息即可');
  }

  return tips;
}

/**
 * @param {{ temperature: number, humidity: number, windSpeed: number, weatherCode: number }} weather
 * @returns {{ category: string, label: string, tips: string[] }[]}
 */
function getSuggestions(weather) {
  return [
    {
      category: 'clothing',
      label: '穿衣',
      tips: clothingTips(weather.temperature),
    },
    {
      category: 'travel',
      label: '出行',
      tips: travelTips(weather),
    },
    {
      category: 'comfort',
      label: '体感',
      tips: comfortTips(weather),
    },
  ];
}

module.exports = { getSuggestions };
