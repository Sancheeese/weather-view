/**
 * Curated local attractions by resolved city name (location.name).
 * Unknown cities return an empty array.
 */

const ATTRACTIONS = {
  beijing: [
    {
      name: '故宫',
      description: '明清皇家宫殿，世界文化遗产',
      tags: ['历史', '地标'],
    },
    {
      name: '天安门广场',
      description: '首都中心广场，升旗仪式与国庆活动举办地',
      tags: ['地标', '广场'],
    },
    {
      name: '颐和园',
      description: '清代皇家园林，昆明湖与万寿山相映成趣',
      tags: ['园林', '历史'],
    },
    {
      name: '长城（八达岭）',
      description: '世界文化遗产，登高可览燕山山脉',
      tags: ['历史', '户外'],
    },
    {
      name: '天坛',
      description: '明清皇帝祭天祈谷之所，回音壁与祈年殿闻名',
      tags: ['历史', '建筑'],
    },
  ],
  shanghai: [
    {
      name: '外滩',
      description: '黄浦江畔万国建筑博览群，夜景经典',
      tags: ['地标', '夜景'],
    },
    {
      name: '东方明珠',
      description: '浦东地标电视塔，可俯瞰陆家嘴天际线',
      tags: ['地标', '观景'],
    },
    {
      name: '豫园',
      description: '明代江南古典园林，毗邻城隍庙老街',
      tags: ['园林', '历史'],
    },
    {
      name: '南京路步行街',
      description: '中华商业第一街，购物与小吃云集',
      tags: ['购物', '街区'],
    },
    {
      name: '田子坊',
      description: '石库门里弄改造的创意文艺街区',
      tags: ['文艺', '街区'],
    },
  ],
  guangzhou: [
    {
      name: '广州塔',
      description: '昵称「小蛮腰」，珠江新城地标观景塔',
      tags: ['地标', '观景'],
    },
    {
      name: '陈家祠',
      description: '岭南建筑艺术瑰宝，木雕砖雕精美',
      tags: ['历史', '建筑'],
    },
    {
      name: '沙面岛',
      description: '欧陆风情历史街区，适合漫步拍照',
      tags: ['街区', '建筑'],
    },
    {
      name: '白云山',
      description: '羊城第一名山，登高可俯瞰全城',
      tags: ['自然', '户外'],
    },
  ],
  shenzhen: [
    {
      name: '世界之窗',
      description: '微缩景观主题公园，一日览尽世界名胜',
      tags: ['主题公园', '家庭'],
    },
    {
      name: '深圳湾公园',
      description: '滨海绿道骑行，可远眺香港新界',
      tags: ['自然', '滨海'],
    },
    {
      name: '华侨城创意文化园',
      description: '旧厂房改造的文创园区，咖啡馆与展览众多',
      tags: ['文艺', '街区'],
    },
    {
      name: '莲花山公园',
      description: '市中心绿肺，山顶邓小平铜像观景台',
      tags: ['公园', '地标'],
    },
  ],
  hangzhou: [
    {
      name: '西湖',
      description: '世界文化遗产，苏堤春晓、断桥残雪等十景闻名',
      tags: ['自然', '地标'],
    },
    {
      name: '灵隐寺',
      description: '千年古刹，飞来峰石窟造像值得一看',
      tags: ['历史', '宗教'],
    },
    {
      name: '西溪湿地',
      description: '城市湿地公园，可乘船穿行芦苇荡',
      tags: ['自然', '湿地'],
    },
    {
      name: '河坊街',
      description: '南宋御街风貌，杭帮小吃与手信集中地',
      tags: ['街区', '美食'],
    },
  ],
  chengdu: [
    {
      name: '大熊猫繁育研究基地',
      description: '近距离观赏国宝大熊猫，建议清晨前往',
      tags: ['自然', '亲子'],
    },
    {
      name: '宽窄巷子',
      description: '清代老街巷改造的休闲街区，品茶掏耳朵',
      tags: ['街区', '文化'],
    },
    {
      name: '武侯祠',
      description: '纪念诸葛亮的祠庙，毗邻锦里古街',
      tags: ['历史', '三国'],
    },
    {
      name: '都江堰',
      description: '两千年前李冰主持修建的水利工程奇迹',
      tags: ['历史', '户外'],
    },
  ],
  xian: [
    {
      name: '兵马俑',
      description: '秦始皇陵陪葬坑，世界第八大奇迹',
      tags: ['历史', '地标'],
    },
    {
      name: '古城墙',
      description: '中国现存最完整的古代城垣，可骑行环城',
      tags: ['历史', '户外'],
    },
    {
      name: '大雁塔',
      description: '唐代佛教建筑，北广场音乐喷泉夜景出色',
      tags: ['历史', '宗教'],
    },
    {
      name: '回民街',
      description: '穆斯林风情美食街，羊肉泡馍、肉夹馍必尝',
      tags: ['美食', '街区'],
    },
  ],
};

/** @type {Record<string, string>} normalized alias -> canonical key */
const ALIAS_TO_KEY = {};

function registerAliases(key, aliases) {
  for (const alias of aliases) {
    ALIAS_TO_KEY[normalize(alias)] = key;
  }
}

registerAliases('beijing', ['beijing', '北京', 'peking', '北京市']);
registerAliases('shanghai', ['shanghai', '上海', '上海市']);
registerAliases('guangzhou', ['guangzhou', '广州', '广州市', 'canton']);
registerAliases('shenzhen', ['shenzhen', '深圳', '深圳市']);
registerAliases('hangzhou', ['hangzhou', '杭州', '杭州市']);
registerAliases('chengdu', ['chengdu', '成都', '成都市']);
registerAliases('xian', ["xi'an", 'xian', '西安', '西安市', '长安']);

function normalize(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'");
}

function resolveCityKey(cityName) {
  if (!cityName) return null;

  const normalized = normalize(cityName);
  if (ALIAS_TO_KEY[normalized]) {
    return ALIAS_TO_KEY[normalized];
  }

  const withoutAdmin = normalized.replace(/(市|省|县|区)$/, '');
  if (ALIAS_TO_KEY[withoutAdmin]) {
    return ALIAS_TO_KEY[withoutAdmin];
  }

  return null;
}

/**
 * @param {string} cityName Resolved city name from geocoding (location.name)
 * @returns {{ name: string, description: string, tags: string[] }[]}
 */
function getAttractions(cityName) {
  const key = resolveCityKey(cityName);
  if (!key || !ATTRACTIONS[key]) {
    return [];
  }
  return ATTRACTIONS[key];
}

module.exports = { getAttractions };
