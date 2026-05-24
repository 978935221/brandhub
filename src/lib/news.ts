import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  NewsCategory,
  type NewsFrontmatter,
  type NewsItem,
} from './news-types';

export { NewsCategory, CATEGORY_MAP } from './news-types';
export type { NewsFrontmatter, NewsItem } from './news-types';

export const CATEGORY_DIR_MAP: Record<string, NewsCategory> = {
  ai: NewsCategory.AI,
  stock: NewsCategory.STOCK,
  entertainment: NewsCategory.ENTERTAINMENT,
  digital: NewsCategory.DIGITAL,
  gaming: NewsCategory.GAMING,
  lifestyle: NewsCategory.LIFESTYLE,
};

const NEWS_ROOT = path.join(process.cwd(), 'content/news');

function getAllCategoryDirs(): string[] {
  return Object.keys(CATEGORY_DIR_MAP);
}

function readNewsFromDir(dirName: string): NewsItem[] {
  const dirPath = path.join(NEWS_ROOT, dirName);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ''),
      frontmatter: data as NewsFrontmatter,
      content,
    };
  });
}

/**
 * 获取所有新闻列表，支持按分类过滤
 */
export function getAllNews(category?: NewsCategory): NewsItem[] {
  let dirs: string[];

  if (category && category !== NewsCategory.ALL) {
    const dirName = Object.keys(CATEGORY_DIR_MAP).find(
      (k) => CATEGORY_DIR_MAP[k] === category
    );
    if (!dirName) return [];
    dirs = [dirName];
  } else {
    dirs = getAllCategoryDirs();
  }

  const allNews = dirs.flatMap((dir) => readNewsFromDir(dir));

  // 按日期降序排列
  allNews.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return allNews;
}

/**
 * 按日期获取新闻，返回按分类分组的结果
 */
export interface NewsByDate {
  date: string;
  items: NewsItem[];
}

export function getNewsByDate(days: number = 7): NewsByDate[] {
  const allNews = getAllNews();
  const now = new Date();
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recent = allNews.filter(
    (n) => new Date(n.frontmatter.date) >= since
  );

  const grouped: Record<string, NewsItem[]> = {};
  recent.forEach((n) => {
    const d = n.frontmatter.date;
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(n);
  });

  return Object.entries(grouped)
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 获取指定分类的新闻列表
 */
export function getNewsByCategory(category: NewsCategory): NewsItem[] {
  return getAllNews(category);
}

/**
 * 按分类和 slug 获取单篇新闻
 */
export function getNewsBySlug(category: string, slug: string): NewsItem | null {
  const newsCategory = CATEGORY_DIR_MAP[category];
  if (!newsCategory) return null;

  const filePath = path.join(NEWS_ROOT, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as NewsFrontmatter,
    content,
  };
}