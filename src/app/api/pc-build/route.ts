import { NextRequest, NextResponse } from 'next/server';

const CPU_DB = [
  { name: "Intel 酷睿 i5-14600KF", price: 1599, cores: "14核20线程", frequency: "3.5-5.3GHz", tdp: "125W", tier: "mid" },
  { name: "Intel 酷睿 i7-14700KF", price: 2499, cores: "20核28线程", frequency: "3.4-5.6GHz", tdp: "125W", tier: "high" },
  { name: "Intel 酷睿 i9-14900KF", price: 3899, cores: "24核32线程", frequency: "3.2-6.0GHz", tdp: "125W", tier: "top" },
  { name: "Intel 酷睿 i5-13600KF", price: 1299, cores: "14核20线程", frequency: "3.5-5.1GHz", tdp: "125W", tier: "mid" },
  { name: "AMD Ryzen 7 7800X3D", price: 2299, cores: "8核16线程", frequency: "4.2-5.0GHz", tdp: "120W", tier: "high" },
  { name: "AMD Ryzen 9 7950X3D", price: 3799, cores: "16核32线程", frequency: "4.2-5.7GHz", tdp: "120W", tier: "top" },
  { name: "AMD Ryzen 5 7600X", price: 1199, cores: "6核12线程", frequency: "4.7-5.3GHz", tdp: "105W", tier: "entry" },
  { name: "Intel 酷睿 i3-14100F", price: 699, cores: "4核8线程", frequency: "3.5-4.7GHz", tdp: "60W", tier: "entry" },
];

const GPU_DB = [
  { name: "NVIDIA RTX 4060 8GB", price: 2199, vram: "8GB GDDR6", tier: "entry" },
  { name: "NVIDIA RTX 4060 Ti 8GB", price: 2999, vram: "8GB GDDR6", tier: "mid" },
  { name: "NVIDIA RTX 4070 Super 12GB", price: 4599, vram: "12GB GDDR6X", tier: "high" },
  { name: "NVIDIA RTX 4070 Ti Super 16GB", price: 6199, vram: "16GB GDDR6X", tier: "high" },
  { name: "NVIDIA RTX 4080 Super 16GB", price: 7999, vram: "16GB GDDR6X", tier: "top" },
  { name: "NVIDIA RTX 4090 24GB", price: 12999, vram: "24GB GDDR6X", tier: "top" },
  { name: "AMD RX 7600 8GB", price: 1699, vram: "8GB GDDR6", tier: "entry" },
  { name: "AMD RX 7700 XT 12GB", price: 2899, vram: "12GB GDDR6", tier: "mid" },
  { name: "AMD RX 7800 XT 16GB", price: 3699, vram: "16GB GDDR6", tier: "high" },
  { name: "AMD RX 7900 XTX 24GB", price: 6999, vram: "24GB GDDR6", tier: "top" },
];

const MB_DB = [
  { name: "微星 B760M MORTAR WIFI DDR5", price: 999, socket: "LGA1700", ram: "DDR5", tier: "mid" },
  { name: "华硕 TUF GAMING B760M-PLUS DDR5", price: 1099, socket: "LGA1700", ram: "DDR5", tier: "mid" },
  { name: "技嘉 Z790 AORUS ELITE DDR5", price: 1899, socket: "LGA1700", ram: "DDR5", tier: "high" },
  { name: "华硕 PRIME B650M-A WIFI", price: 899, socket: "AM5", ram: "DDR5", tier: "mid" },
  { name: "微星 MAG B650M MORTAR WIFI", price: 1199, socket: "AM5", ram: "DDR5", tier: "mid" },
  { name: "技嘉 B650 AORUS ELITE AX", price: 1399, socket: "AM5", ram: "DDR5", tier: "high" },
  { name: "华硕 ROG STRIX X670E-A", price: 2699, socket: "AM5", ram: "DDR5", tier: "top" },
];

const RAM_DB = [
  { name: "金士顿 FURY 32GB DDR5 6000MHz", price: 699, size: "32GB", tier: "mid" },
  { name: "芝奇 幻锋戟 32GB DDR5 6400MHz", price: 799, size: "32GB", tier: "high" },
  { name: "金士顿 FURY 16GB DDR5 5600MHz", price: 399, size: "16GB", tier: "entry" },
  { name: "芝奇 幻锋戟 64GB DDR5 6000MHz", price: 1599, size: "64GB", tier: "top" },
];

const SSD_DB = [
  { name: "三星 990 PRO 1TB NVMe", price: 699, size: "1TB", tier: "high" },
  { name: "西部数据 SN850X 1TB NVMe", price: 629, size: "1TB", tier: "high" },
  { name: "致态 TiPlus7100 1TB NVMe", price: 479, size: "1TB", tier: "mid" },
  { name: "三星 990 PRO 2TB NVMe", price: 1299, size: "2TB", tier: "top" },
  { name: "金士顿 NV2 1TB NVMe", price: 359, size: "1TB", tier: "entry" },
];

const PSU_DB = [
  { name: "海韵 Focus GX-750 金牌全模组", price: 699, watt: 750, tier: "mid" },
  { name: "振华 Leadex III 850W 金牌", price: 799, watt: 850, tier: "high" },
  { name: "海韵 Focus GX-1000 金牌", price: 1199, watt: 1000, tier: "top" },
  { name: "酷冷至尊 MWE 650W 铜牌", price: 349, watt: 650, tier: "entry" },
];

const CASE_DB = [
  { name: "联力 LANCOOL 216 黑色", price: 429, tier: "mid" },
  { name: "追风者 P400A 黑色", price: 369, tier: "entry" },
  { name: "海盗船 4000D Airflow", price: 599, tier: "mid" },
  { name: "联力 O11 Dynamic EVO", price: 899, tier: "high" },
  { name: "NZXT H7 Flow 黑色", price: 699, tier: "high" },
];

const COOLER_DB = [
  { name: "利民 PA120 SE 双塔风冷", price: 139, tier: "entry" },
  { name: "瓦尔基里 A360 360水冷", price: 299, tier: "mid" },
  { name: "九州风神 冰堡垒 360 水冷", price: 449, tier: "high" },
  { name: "华硕 ROG 龙神三代 360", price: 1799, tier: "top" },
  { name: "利民 FC140 双塔风冷", price: 239, tier: "mid" },
];

function closest<T>(arr: T[], fn: (item: T) => number): T {
  return arr.reduce((a, b) => (fn(a) < fn(b) ? a : b));
}

export async function POST(req: NextRequest) {
  const { budget } = await req.json();
  const b = Number(budget);

  if (isNaN(b) || b < 3000 || b > 100000) {
    return NextResponse.json({ error: '预算范围 3000-100000' }, { status: 400 });
  }

  const ratios = { cpu: 0.25, gpu: 0.35, mb: 0.08, ram: 0.07, ssd: 0.06, psu: 0.07, case: 0.05, cooler: 0.04 };

  const cpu = closest(CPU_DB, (x) => Math.abs(x.price - b * ratios.cpu));
  const socket = cpu.name.includes('AMD') || cpu.name.includes('Ryzen') ? 'AM5' : 'LGA1700';

  const mbCandidates = MB_DB.filter((m) => m.socket === socket);
  const mb = closest(mbCandidates.length ? mbCandidates : MB_DB, (x) => Math.abs(x.price - b * ratios.mb));

  const gpu = closest(GPU_DB, (x) => Math.abs(x.price - b * ratios.gpu));
  const ram = closest(RAM_DB, (x) => Math.abs(x.price - b * ratios.ram));
  const ssd = closest(SSD_DB, (x) => Math.abs(x.price - b * ratios.ssd));

  let psuCandidates = PSU_DB;
  if (gpu.name.includes('4090') || gpu.name.includes('4080')) psuCandidates = PSU_DB.filter((p) => p.watt >= 850);
  else if (gpu.name.includes('4070') || gpu.name.includes('XTX') || gpu.name.includes('XT')) psuCandidates = PSU_DB.filter((p) => p.watt >= 750);
  const psu = closest(psuCandidates.length ? psuCandidates : PSU_DB, (x) => Math.abs(x.price - b * ratios.psu));

  const box = closest(CASE_DB, (x) => Math.abs(x.price - b * ratios.case));
  const cooler = closest(COOLER_DB, (x) => Math.abs(x.price - b * ratios.cooler));

  const total = cpu.price + gpu.price + mb.price + ram.price + ssd.price + psu.price + box.price + cooler.price;

  return NextResponse.json({
    budget: b,
    total,
    cpu,
    gpu,
    motherboard: mb,
    ram,
    ssd,
    psu,
    case: box,
    cooler,
  });
}