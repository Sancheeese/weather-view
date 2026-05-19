/**
 * Curated local attractions by resolved city name (MVP static data).
 */

const ATTRACTIONS_BY_CITY = {
  beijing: [
    { name: '故宫', description: '明清皇家宫殿，世界文化遗产', tags: ['历史', '地标'] },
    { name: '天安门广场', description: '首都中心广场，可观看升旗仪式', tags: ['地标', '广场'] },
    { name: '颐和园', description: '清代皇家园林，昆明湖与万寿山', tags: ['园林', '历史'] },
    { name: '长城（八达岭）', description: '世界文化遗产，登高望远', tags: ['历史', '户外'] },
    { name: '天坛', description: '明清皇帝祭天之所，祈年殿为标志', tags: ['历史', '建筑'] },
  ],
  shanghai: [
    { name: '外滩', description: '黄浦江畔万国建筑博览，夜景迷人', tags: ['地标', '夜景'] },
    { name: '东方明珠', description: '浦东标志性电视塔，可登塔观景', tags: ['地标', '观景'] },
    { name: '豫园', description: '明代江南古典园林，毗邻城隍庙', tags: ['园林', '历史'] },
    { name: '南京路步行街', description: '中华商业第一街，购物与小吃', tags: ['购物', '街区'] },
    { name: '田子坊', description: '石库门里弄改造的创意文艺街区', tags: ['文艺', '街区'] },
  ],
  guangzhou: [
    { name: '广州塔', description: '昵称「小蛮腰」，城市地标观景塔', tags: ['地标', '观景'] },
    { name: '陈家祠', description: '广东民间工艺博物馆，岭南建筑精华', tags: ['历史', '建筑'] },
    { name: '沙面岛', description: '欧陆风情历史街区，适合漫步拍照', tags: ['街区', '建筑'] },
    { name: '白云山', description: '南粤名山，登高俯瞰羊城', tags: ['自然', '户外'] },
  ],
  shenzhen: [
    { name: '世界之窗', description: '微缩景观主题公园，一日环游世界', tags: ['主题公园'] },
    { name: '欢乐谷', description: '大型主题乐园，适合亲子与年轻人', tags: ['主题公园'] },
    { name: '深圳湾公园', description: '滨海绿道，可远眺香港', tags: ['自然', '海滨'] },
    { name: '大梅沙', description: '深圳著名海滨浴场，沙滩与海景', tags: ['海滨', '户外'] },
  ],
  hangzhou: [
    { name: '西湖', description: '世界文化遗产，苏堤春晓、断桥残雪', tags: ['自然', '地标'] },
    { name: '灵隐寺', description: '千年古刹，飞来峰石窟造像', tags: ['历史', '宗教'] },
    { name: '雷峰塔', description: '西湖畔名塔，白娘子传说地标', tags: ['历史', '地标'] },
    { name: '西溪湿地', description: '城市湿地公园，水乡生态', tags: ['自然', '湿地'] },
  ],
  chengdu: [
    { name: '大熊猫繁育研究基地', description: '近距离观赏国宝大熊猫', tags: ['动物', '亲子'] },
    { name: '宽窄巷子', description: '清代街区改造的休闲文化巷', tags: ['街区', '美食'] },
    { name: '武侯祠', description: '纪念诸葛亮的祠庙，三国文化', tags: ['历史'] },
    { name: '都江堰', description: '两千余年水利工程，世界文化遗产', tags: ['历史', '自然'] },
  ],
  xian: [
    { name: '兵马俑', description: '秦始皇陵陪葬坑，世界第八大奇迹', tags: ['历史', '地标'] },
    { name: '古城墙', description: '中国现存最完整的古代城垣', tags: ['历史', '户外'] },
    { name: '大雁塔', description: '唐代佛教建筑，大唐不夜城毗邻', tags: ['历史', '宗教'] },
    { name: '回民街', description: '穆斯林风情美食街，牛羊肉泡馍', tags: ['美食', '街区'] },
  ],
  nanjing: [
    { name: '中山陵', description: '孙中山先生陵寝，紫金山麓', tags: ['历史', '地标'] },
    { name: '夫子庙', description: '秦淮河畔古建筑群与夜市', tags: ['历史', '美食'] },
    { name: '明孝陵', description: '明太祖朱元璋陵寝，石象路', tags: ['历史'] },
    { name: '玄武湖', description: '江南三大名湖之一，城中休闲', tags: ['自然', '湖泊'] },
  ],
};

const CITY_ALIASES = {
  beijing: ['beijing', '北京', 'peking'],
  shanghai: ['shanghai', '上海'],
  guangzhou: ['guangzhou', '广州', 'canton'],
  shenzhen: ['shenzhen', '深圳'],
  hangzhou: ['hangzhou', '杭州'],
  chengdu: ['chengdu', '成都'],
  xian: ["xi'an", 'xian', '西安'],
  nanjing: ['nanjing', '南京', 'nanking'],
};

function normalizeCityKey(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/['’]/g, '');
}

function resolveCityBucket(cityName) {
  const normalized = normalizeCityKey(cityName);
  for (const [bucket, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.some((alias) => normalizeCityKey(alias) === normalized)) {
      return bucket;
    }
  }
  return null;
}

/**
 * @param {string} cityName Resolved location name from geocoding
 * @returns {{ name: string; description?: string; tags?: string[] }[]}
 */
function getAttractions(cityName) {
  const bucket = resolveCityBucket(cityName);
  if (!bucket) return [];
  return ATTRACTIONS_BY_CITY[bucket] ?? [];
}

module.exports = { getAttractions };
