export enum NewsCategory {
  ALL = 'all',
  AI = 'ai',
  STOCK = 'stock',
  ENTERTAINMENT = 'entertainment',
  DIGITAL = 'digital',
  GAMING = 'gaming',
  LIFESTYLE = 'lifestyle',
}

export const CATEGORY_MAP: Record<NewsCategory, string> = {
  [NewsCategory.ALL]: '全部',
  [NewsCategory.AI]: 'AI 前沿',
  [NewsCategory.STOCK]: '股市财经',
  [NewsCategory.ENTERTAINMENT]: '娱乐八卦',
  [NewsCategory.DIGITAL]: '数码新品',
  [NewsCategory.GAMING]: '游戏电竞',
  [NewsCategory.LIFESTYLE]: '生活方式',
};

export interface NewsFrontmatter {
  title: string;
  date: string;
  category: string;
  summary: string;
}

export interface NewsItem {
  slug: string;
  frontmatter: NewsFrontmatter;
  content: string;
}