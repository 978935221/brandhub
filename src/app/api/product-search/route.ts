import { NextRequest, NextResponse } from 'next/server';

// 本地产品库（扩展版）
const LOCAL_DB: Record<string, any[]> = {
  '手机': [
    { name: 'iPhone 17 Pro', brand: 'Apple', price: 7999, rating: 8.5, specs: { '屏幕': '6.3" OLED 120Hz', '芯片': 'A19 Pro', '内存': '8GB', '存储': '256GB 起', '主摄': '48MP', '长焦': '5× 光学变焦', '续航': '28 小时视频', '重量': '198g' }, pros: ['视频能力接近专业相机', 'A19 Pro 性能强劲', 'iOS 生态完整', '10× 光学变焦'], cons: ['夜景不如安卓旗舰', '充电速度偏慢', '价格不菲'] },
    { name: '华为 P80 Ultra', brand: '华为', price: 8999, rating: 9.2, specs: { '屏幕': '6.8" OLED 120Hz', '芯片': '麒麟 9100', '内存': '12GB', '存储': '256GB 起', '主摄': '50MP 可变光圈', '长焦': '3.5×', '续航': '5500mAh 88W', '重量': '225g' }, pros: ['夜拍之王', '卫星通信', '昆仑玻璃 3 代'], cons: ['GMS 缺失', '应用生态待完善'] },
    { name: '小米 17 Ultra', brand: '小米', price: 6499, rating: 8.9, specs: { '屏幕': '6.73" 2K AMOLED', '芯片': '骁龙 8 Gen 4', '内存': '12GB', '主摄': '50MP 一英寸', '长焦': '5×', '续航': '5000mAh 120W', '重量': '215g' }, pros: ['一英寸主摄', '徕卡联名', '性价比最高', '120W快充'], cons: ['长焦不如竞品', '系统广告偏多'] },
    { name: '三星 Galaxy S26 Ultra', brand: '三星', price: 9699, rating: 8.8, specs: { '屏幕': '6.9" Dynamic AMOLED', '芯片': '骁龙 8 Gen 4 for Galaxy', '内存': '12GB', '存储': '256GB 起', '主摄': '200MP', '长焦': '10× 光学变焦', '续航': '5000mAh 45W' }, pros: ['屏幕天花板', '长焦最强', 'S Pen 加持', 'One UI 流畅'], cons: ['充电太慢', '价格最高', '系统更新慢'] },
    { name: 'OPPO Find X9 Pro', brand: 'OPPO', price: 5999, rating: 8.3, specs: { '屏幕': '6.82" OLED 120Hz', '芯片': '骁龙 8 Gen 4', '内存': '12GB', '主摄': '50MP 哈苏', '长焦': '6× 光学变焦', '续航': '5400mAh 100W' }, pros: ['哈苏色彩优秀', '续航最强', '充电快'], cons: ['性能调校保守', '品牌溢价'] },
  ],
  '笔记本': [
    { name: 'MacBook Pro 16" M6 Max', brand: 'Apple', price: 24999, rating: 9.0, specs: { '处理器': 'M6 Max 18核', 'GPU': '48核', '内存': '48GB', '存储': '1TB SSD', '屏幕': '16.2" Mini-LED', '重量': '2.15kg', '续航': '21小时' }, pros: ['性能天花板', '续航断崖领先', '屏幕顶级'], cons: ['价格昂贵', '游戏生态弱', '无法外接独显'] },
    { name: 'MacBook Air 15" M6', brand: 'Apple', price: 10999, rating: 8.7, specs: { '处理器': 'M6 8核', 'GPU': '10核', '内存': '16GB', '存储': '256GB', '屏幕': '15.3" Liquid Retina', '重量': '1.5kg', '续航': '18小时' }, pros: ['极致轻薄', '续航无敌', '无风扇静音'], cons: ['性能有限', '接口太少', '256GB起步太小'] },
    { name: 'ThinkPad X1 Carbon Gen 13', brand: '联想', price: 12999, rating: 8.5, specs: { '处理器': 'Intel Ultra 7', '内存': '32GB', '存储': '1TB', '屏幕': '14" 2.8K OLED', '重量': '1.08kg', '续航': '15小时' }, pros: ['键盘天花板', '极致轻便', '商务首选'], cons: ['GPU弱', '价格高', 'OLED反光'] },
    { name: 'ROG 枪神 8 Plus', brand: '华硕', price: 15999, rating: 9.1, specs: { '处理器': 'i9-14900HX', 'GPU': 'RTX 4080 12GB', '内存': '32GB', '存储': '1TB', '屏幕': '18" 2.5K 240Hz', '重量': '3.1kg' }, pros: ['游戏性能拉满', '屏幕超大', '散热优秀'], cons: ['重量劝退', '续航差', '风扇噪音大'] },
  ],
  '耳机': [
    { name: 'Sony WH-1000XM7', brand: '索尼', price: 2999, rating: 8.8, specs: { '类型': '头戴式 无线降噪', '蓝牙': '5.4 LDAC', '续航': '40小时', '重量': '252g', '驱动单元': '40mm' }, pros: ['降噪能力最强', '续航表现优秀', '佩戴舒适'], cons: ['音质不如AirPods Max', '通话降噪一般'] },
    { name: 'AirPods Max 2', brand: 'Apple', price: 4599, rating: 8.8, specs: { '类型': '头戴式 无线降噪', '蓝牙': '5.4', '续航': '28小时', '重量': '385g', '驱动单元': '42mm 定制' }, pros: ['音质断层领先', '空间音频最佳', '苹果生态无缝'], cons: ['重量是硬伤', '价格最贵', '没有3.5mm'] },
    { name: 'AirPods Pro 4', brand: 'Apple', price: 1899, rating: 9.0, specs: { '类型': '入耳式 无线降噪', '蓝牙': '5.4', '续航': '8小时(+30h)', '重量': '5.3g/只', '芯片': 'H3' }, pros: ['降噪通透双优', '空间音频', '生态无缝'], cons: ['电池不可换', '安卓体验打折'] },
  ],
  'AI工具': [
    { name: 'GPT-5 (OpenAI)', brand: 'OpenAI', price: 20, rating: 9.2, specs: { '类型': '通用大模型', '上下文': '200K', '多模态': '文本+图像+音频', '编程': 'HumanEval+ 第一' }, pros: ['综合能力最强', '编程大幅领先', '推理质量高'], cons: ['创意写作不如Claude', '价格偏贵'] },
    { name: 'Claude 4 Opus', brand: 'Anthropic', price: 20, rating: 9.0, specs: { '类型': '通用大模型', '上下文': '500K', '多模态': '文本+图像', '编程': 'SWE-bench 第二' }, pros: ['中文写作最强', '超长上下文', '性价比高'], cons: ['编程弱于GPT-5', '无原生音频'] },
    { name: 'Gemini 2.5 Pro', brand: 'Google', price: 20, rating: 8.5, specs: { '类型': '通用大模型', '上下文': '200K', '多模态': '文本+图像+音频+视频' }, pros: ['多模态最强', '与Google生态集成'], cons: ['推理能力不稳定', '中文不如竞品'] },
  ],
  '显卡': [
    { name: 'NVIDIA RTX 4090 24GB', brand: 'NVIDIA', price: 12999, specs: { '显存': '24GB GDDR6X', 'CUDA': '16384', '功耗': '450W', '接口': 'PCIe 4.0 ×16' }, pros: ['性能之王', '24GB大显存', '光追最强'], cons: ['价格高', '功耗大', '体积庞大'] },
    { name: 'NVIDIA RTX 4080 Super 16GB', brand: 'NVIDIA', price: 7999, specs: { '显存': '16GB GDDR6X', 'CUDA': '10240', '功耗': '320W', '接口': 'PCIe 4.0 ×16' }, pros: ['4K游戏无压力', '能效比高'], cons: ['价格不低', '16GB显存略紧'] },
    { name: 'NVIDIA RTX 4070 Super 12GB', brand: 'NVIDIA', price: 4599, specs: { '显存': '12GB GDDR6X', '功耗': '220W', '接口': 'PCIe 4.0 ×16' }, pros: ['2K游戏神器', '功耗友好'], cons: ['12GB显存', '4K吃力'] },
    { name: 'AMD RX 7900 XTX 24GB', brand: 'AMD', price: 6999, specs: { '显存': '24GB GDDR6', '功耗': '355W', '接口': 'PCIe 4.0 ×16' }, pros: ['24GB大显存', '性价比高'], cons: ['光追弱', '驱动不稳定'] },
  ],
};

const CATEGORY_ALIASES: Record<string, string> = {
  '手机': '手机', '电脑': '笔记本', '笔记本': '笔记本', '笔记本电脑': '笔记本',
  '耳机': '耳机', '音箱': '耳机', 'AI': 'AI工具', 'ai': 'AI工具', 'gpt': 'AI工具',
  '显卡': '显卡', 'gpu': '显卡', 'CPU': '显卡', 'cpu': '显卡', '处理器': '显卡',
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || '';
  const category = req.nextUrl.searchParams.get('category') || '';

  if (!query && !category) {
    return NextResponse.json({ results: [] });
  }

  const results: any[] = [];
  const q = query.toLowerCase();

  // 搜索本地库
  for (const [cat, products] of Object.entries(LOCAL_DB)) {
    if (category && cat !== category) continue;
    for (const p of products) {
      const nameLower = p.name.toLowerCase();
      const brandLower = (p.brand || '').toLowerCase();
      if (!q || nameLower.includes(q) || brandLower.includes(q)) {
        results.push({ ...p, category: cat, id: `${cat}-${p.name.replace(/\s/g, '-')}`.toLowerCase(), source: 'BrandHub 数据库' });
      }
    }
  }

  // 跨品类搜索
  if (!category && q) {
    for (const [alias, cat] of Object.entries(CATEGORY_ALIASES)) {
      if (q.includes(alias.toLowerCase()) && !results.some(r => r.category === cat)) {
        const catProducts = LOCAL_DB[cat] || [];
        for (const p of catProducts) {
          results.push({ ...p, category: cat, id: `${cat}-${p.name.replace(/\s/g, '-')}`.toLowerCase(), source: 'BrandHub 数据库' });
        }
      }
    }
  }

  // 去重
  const seen = new Set<string>();
  const unique = results.filter(r => {
    const key = r.id || r.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ results: unique.slice(0, 20) });
}