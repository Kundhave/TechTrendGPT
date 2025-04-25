import { fetchLatestTechNews, formatNewsArticles } from '../app/utils/newsApi';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testNewsApi() {
  try {
    console.log('Testing NewsAPI integration...');
    
    // Check if the API key is set
    if (!process.env.NEWS_API_KEY) {
      console.error('NEWS_API_KEY environment variable is not set');
      process.exit(1);
    }
    
    // Fetch the latest tech news
    console.log('Fetching latest tech news...');
    const newsArticles = await fetchLatestTechNews(3);
    
    // Format the news articles
    const formattedNews = formatNewsArticles(newsArticles);
    
    // Print the formatted news
    console.log('\nLatest Tech News:');
    console.log(formattedNews);
    
    console.log('\nNewsAPI integration test completed successfully!');
  } catch (error) {
    console.error('Error testing NewsAPI integration:', error);
    process.exit(1);
  }
}

// Run the test
testNewsApi(); 