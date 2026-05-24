import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostFrontmatter {
  title: string;
  date: string;
  category?: string;
  summary: string;
  featured?: boolean;
  image?: string;
  rating?: number;
  verdict?: string;
  tags?: string[];
  rankCount?: number;
  updateFrequency?: string;
}

export interface PostItem {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

const CONTENT_DIRS = ['reviews', 'rankings', 'articles'] as const;
const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * 获取所有文章列表，支持按分类目录过滤
 */
export function getAllPosts(category?: string): PostItem[] {
  const dirs = category
    ? [category]
    : [...CONTENT_DIRS];

  const allPosts: PostItem[] = [];

  dirs.forEach((dir) => {
    const dirPath = path.join(CONTENT_ROOT, dir);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      allPosts.push({
        slug: `${dir}/${file.replace(/\.md$/, '')}`,
        frontmatter: data as PostFrontmatter,
        content,
      });
    });
  });

  allPosts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return allPosts;
}

/**
 * 通过 slug 获取单篇文章
 */
export function getPostBySlug(category: string, slug: string): PostItem | null {
  const filePath = path.join(CONTENT_ROOT, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug: `${category}/${slug}`,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

/**
 * 获取推荐文章（标记为 featured 的文章）
 */
export function getFeaturedPosts(limit: number = 6): PostItem[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter((p) => p.frontmatter.featured === true)
    .slice(0, limit);
}