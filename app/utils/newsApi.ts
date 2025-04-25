import axios from 'axios';

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export async function fetchLatestTechNews(count: number = 5): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEWS_API_KEY environment variable is not set');
    }
    
    const response = await axios.get<NewsApiResponse>(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=${count}`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );
    
    if (response.data.status !== 'ok') {
      throw new Error(`NewsAPI returned status: ${response.data.status}`);
    }
    
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching tech news:', error);
    throw error;
  }
}

export function formatNewsArticles(articles: NewsArticle[]): string {
  if (!articles.length) {
    return 'No recent tech news articles found.';
  }
  
  return articles.map((article, index) => {
    const date = new Date(article.publishedAt).toLocaleDateString();
    return `${index + 1}. "${article.title}" - ${article.source.name} (${date})
    ${article.description || ''}
    URL: ${article.url}`;
  }).join('\n\n');
}

export function isNewsQuery(query: string): boolean {
  const newsKeywords = [
    'news', 'latest', 'recent', 'today', 'this week', 'this month',
    'headlines', 'updates', 'what\'s new', 'whats new', 'what is new',
    'top', 'trending', 'current', 'breaking'
  ];
  
  const lowerQuery = query.toLowerCase();
  
  return newsKeywords.some(keyword => lowerQuery.includes(keyword));
}