/**
 * 新闻自动生成脚本
 *
 * 核心流程：
 * 1. 从配置的数据源拉取新闻内容（API / RSS / 爬虫）
 * 2. 解析并归类新闻到对应分类（ai / stock / entertainment / digital / gaming / lifestyle）
 * 3. 生成带 frontmatter 的 Markdown 文件到 content/news/<category>/ 目录
 * 4. 自动去重：对比已有文件标题/日期，避免重复生成
 * 5. 打日志记录生成结果
 *
 * 扩展方向：
 * - 集成 OpenAI / 第三方新闻 API 获取实时新闻
 * - 使用 NLP 模型自动分类新闻
 * - 支持定时任务（cron / GitHub Actions）每日自动运行
 * - 生成后自动提交 Git
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // content/news 目录的绝对路径
  newsRoot: path.join(__dirname, '..', 'content', 'news'),

  // 分类映射
  categories: ['ai', 'stock', 'entertainment', 'digital', 'gaming', 'lifestyle'],

  // 示例新闻模板（实际使用时替换为 API 数据）
  sampleNews: [
    {
      title: '示例新闻标题',
      date: new Date().toISOString().slice(0, 10),
      category: 'ai',
      summary: '新闻摘要（AI 自动生成或从来源提取）',
      content: '## 新闻正文\n\n此处为新闻详细内容。',
    },
  ],
};

/**
 * 生成 Markdown 文件
 * @param {object} item - 新闻数据 { title, date, category, summary, content }
 */
function generateMarkdownFile(item) {
  const { title, date, category, summary, content } = item;

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date}"`,
    `category: "${category}"`,
    `summary: "${summary}"`,
    '---',
  ].join('\n');

  const slug = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const filename = `${date}-${slug}.md`;
  const dirPath = path.join(CONFIG.newsRoot, category);

  // 确保目录存在
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, filename);

  // 去重检查
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] 文件已存在: ${filename}`);
    return null;
  }

  fs.writeFileSync(filePath, `${frontmatter}\n\n${content}`, 'utf-8');
  console.log(`[DONE] 生成: ${category}/${filename}`);
  return filePath;
}

/**
 * 主函数 — 从数据源获取新闻并生成文件
 * TODO: 接入真实新闻 API
 */
async function main() {
  console.log('=== BrandHub 新闻自动生成 ===');
  console.log(`时间: ${new Date().toISOString()}`);
  console.log(`目标目录: ${CONFIG.newsRoot}\n`);

  // TODO: 调用新闻数据源 API
  // const newsItems = await fetchNewsFromAPI();

  // 使用示例数据演示
  const newsItems = CONFIG.sampleNews;

  let generated = 0;
  let skipped = 0;

  newsItems.forEach((item) => {
    const result = generateMarkdownFile(item);
    if (result) {
      generated++;
    } else {
      skipped++;
    }
  });

  console.log(`\n=== 完成: 生成 ${generated} 篇, 跳过 ${skipped} 篇 ===`);
}

// 仅在直接执行时运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateMarkdownFile, CONFIG };