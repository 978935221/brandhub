export interface ProductSpec {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image?: string;
  rating: number;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  verdict: string;
  reviewSlug: string;
}

// 统一的产品规格数据库
export const products: ProductSpec[] = [
  {
    id: 'macbook-m6-max',
    name: 'MacBook Pro 16" M6 Max',
    category: '笔记本电脑',
    brand: 'Apple',
    price: 24999,
    rating: 9.0,
    specs: {
      '处理器': 'Apple M6 Max (18核)',
      '显卡': '48核 GPU',
      '内存': '48GB 统一内存',
      '存储': '1TB SSD',
      '屏幕': '16.2" Mini-LED, 3456×2234',
      '重量': '2.15kg',
      '续航': '21小时 (办公)',
      '接口': '雷雳 5 ×3, HDMI, SDXC, MagSafe',
      '系统': 'macOS 26',
    },
    pros: ['性能天花板', '续航断崖式领先', '256GB 统一内存可选', '屏幕素质顶级'],
    cons: ['价格昂贵', '游戏生态弱', '无法外接独显'],
    verdict: '推荐',
    reviewSlug: 'reviews/macbook-m6-review',
  },
  {
    id: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    category: '手机',
    brand: 'Apple',
    price: 7999,
    rating: 8.5,
    specs: {
      '处理器': 'A19 Pro (3nm)',
      '屏幕': '6.3" OLED, 120Hz ProMotion',
      '内存': '8GB',
      '存储': '256GB 起',
      '主摄': '48MP, f/1.7, 1/1.3"',
      '长焦': '5× 光学变焦',
      '超长焦': '10× 光学变焦',
      '续航': '视频播放 28 小时',
      '重量': '198g',
      '系统': 'iOS 20',
    },
    pros: ['视频能力逼近专业相机', 'A19 Pro 性能强劲', 'iOS 生态完整', '10× 光学变焦'],
    cons: ['夜景不如安卓旗舰', '充电速度偏慢', '价格不菲'],
    verdict: '推荐',
    reviewSlug: 'reviews/iphone17-review',
  },
  {
    id: 'huawei-p80-ultra',
    name: '华为 P80 Ultra',
    category: '手机',
    brand: '华为',
    price: 8999,
    rating: 9.2,
    specs: {
      '处理器': '麒麟 9100',
      '屏幕': '6.8" OLED, 120Hz LTPO',
      '内存': '12GB',
      '存储': '256GB 起',
      '主摄': '50MP, f/1.4-f/4.0 可变光圈',
      '长焦': '3.5× 光学变焦',
      '超长焦': '10× 潜望式',
      '续航': '5500mAh, 88W 有线',
      '重量': '225g',
      '系统': 'HarmonyOS 6',
    },
    pros: ['夜拍之王', '卫星通信', '昆仑玻璃 3 代', '鸿蒙生态'],
    cons: ['GMS 缺失', '应用生态待完善', '重量偏重'],
    verdict: '强烈推荐',
    reviewSlug: '',
  },
  {
    id: 'xiaomi-17-ultra',
    name: '小米 17 Ultra',
    category: '手机',
    brand: '小米',
    price: 6499,
    rating: 8.9,
    specs: {
      '处理器': '骁龙 8 Gen 4',
      '屏幕': '6.73" AMOLED, 2K 120Hz',
      '内存': '12GB',
      '存储': '256GB 起',
      '主摄': '50MP, 一英寸, f/1.6',
      '长焦': '5× 光学变焦',
      '超长焦': '—',
      '续航': '5000mAh, 120W 有线',
      '重量': '215g',
      '系统': 'HyperOS 3',
    },
    pros: ['一英寸主摄', '徕卡联名调色', '性价比旗舰最高', '120W 快充'],
    cons: ['长焦不如竞品', '系统广告偏多', '设计辨识度一般'],
    verdict: '推荐',
    reviewSlug: '',
  },
  {
    id: 'sony-wh1000xm7',
    name: 'Sony WH-1000XM7',
    category: '耳机',
    brand: '索尼',
    price: 2999,
    rating: 8.8,
    specs: {
      '类型': '头戴式 无线降噪',
      '降噪芯片': 'QN3',
      '蓝牙': '5.4, LDAC',
      '续航': '40 小时 (降噪开)',
      '充电': 'USB-C, 快充 3分钟=3小时',
      '重量': '252g',
      '驱动单元': '40mm',
      '编解码': 'SBC/AAC/LDAC/aptX HD',
    },
    pros: ['降噪能力最强', '续航表现优秀', '佩戴舒适', '价格合理'],
    cons: ['音质不如 AirPods Max 2', '通话降噪一般', '塑料感较强'],
    verdict: '推荐',
    reviewSlug: 'reviews/sony-xm7-review',
  },
  {
    id: 'airpods-max-2',
    name: 'AirPods Max 2',
    category: '耳机',
    brand: 'Apple',
    price: 4599,
    rating: 8.8,
    specs: {
      '类型': '头戴式 无线降噪',
      '降噪芯片': 'H3',
      '蓝牙': '5.4',
      '续航': '28 小时 (降噪开)',
      '充电': 'USB-C + MagSafe',
      '重量': '385g',
      '驱动单元': '42mm 定制',
      '编解码': 'SBC/AAC/ALAC',
    },
    pros: ['音质断层领先', '空间音频体验最佳', '苹果生态无缝', '做工精致'],
    cons: ['重量是硬伤', '价格最贵', '没有 3.5mm 接口'],
    verdict: '推荐',
    reviewSlug: 'reviews/sony-xm7-review',
  },
  {
    id: 'ai-gpt5',
    name: 'GPT-5 (OpenAI)',
    category: 'AI工具',
    brand: 'OpenAI',
    price: 20,
    rating: 9.2,
    specs: {
      '类型': '通用大模型',
      '上下文': '200K tokens',
      '多模态': '文本 + 图像 + 音频',
      '编程': 'HumanEval+ 第一',
      '推理': 'GPQA / MMLU-Pro 领先',
      '价格': '$20/月 (Plus) / $200/月 (Pro)',
      '免费额度': '10 次/小时',
      'API': '支持',
    },
    pros: ['综合能力最强', '编程大幅领先', '推理质量高', '多模态理解力强'],
    cons: ['创意写作不如 Claude', '价格偏贵', '免费额度紧'],
    verdict: '强烈推荐',
    reviewSlug: 'reviews/gpt5-review',
  },
  {
    id: 'ai-claude4',
    name: 'Claude 4 Opus (Anthropic)',
    category: 'AI工具',
    brand: 'Anthropic',
    price: 20,
    rating: 9.0,
    specs: {
      '类型': '通用大模型',
      '上下文': '500K tokens',
      '多模态': '文本 + 图像',
      '编程': 'SWE-bench 第二',
      '推理': '深度推理能力出色',
      '价格': '$20/月 (Pro)',
      '免费额度': '30 次/天',
      'API': '支持',
    },
    pros: ['中文写作最强', '超长上下文', '安全对齐好', '性价比高'],
    cons: ['编程弱于 GPT-5', '无原生音频', '功能更新慢'],
    verdict: '推荐',
    reviewSlug: '',
  },
];

// 按品类分组
export function getProductsByCategory(): Record<string, ProductSpec[]> {
  const grouped: Record<string, ProductSpec[]> = {};
  products.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });
  return grouped;
}

// 获取单个产品
export function getProductById(id: string): ProductSpec | undefined {
  return products.find((p) => p.id === id);
}

// 获取所有品类
export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}