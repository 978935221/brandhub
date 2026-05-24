import { getAllNews } from '@/lib/news';
import NewsSectionClient from './NewsSectionClient';

export default function NewsSection() {
  const allNews = getAllNews();

  return <NewsSectionClient allNews={JSON.parse(JSON.stringify(allNews))} />;
}