import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export { loadSampleData };

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
} = process.env;

if (!ASTRA_DB_NAMESPACE || !ASTRA_DB_COLLECTION || !ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN || !OPENAI_API_KEY) {
    throw new Error("Missing a required environment variable. Please check your .env file.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const ttData = [
    "https://openai.com/research/",
    "https://ai.meta.com/blog/",
    "https://deepmind.google/discover/blog/",
    "https://www.anthropic.com/news",
    "https://blogs.nvidia.com/",
    "https://blog.eleuther.ai/",
    "https://www.alignmentforum.org/",
    "https://ai.googleblog.com/",
    "https://huggingface.co/blog/",
    "https://research.ibm.com/blog/",
    "https://www.microsoft.com/en-us/research/blog/",
    "https://arxiv.org/list/cs.AI/recent",
    "https://www.nature.com/nature/articles",
    "https://thegradient.pub/",
    "https://www.reddit.com/r/MachineLearning/",
    "https://news.ycombinator.com/",
    "https://techcrunch.com/tag/artificial-intelligence/",
    "https://www.theverge.com/ai-artificial-intelligence",
    "https://www.technologyreview.com/topic/artificial-intelligence/",
    "https://spectrum.ieee.org/artificial-intelligence",
    "https://futurism.com/artificial-intelligence",
    "https://platform.openai.com/docs/",
    "https://github.com/HackerNews/API",
    "https://huggingface.co/models",
    "https://www.reddit.com/dev/api/",
    "https://www.insidequantumtechnology.com/",
    "https://www.quantamagazine.org/",
    "https://quantumcomputingreport.com/",
    // Additional sources
    "https://www.wired.com/",
    "https://www.techradar.com/",
    "https://www.engadget.com/",
    "https://www.cnet.com/",
    "https://arstechnica.com/",
    "https://www.coindesk.com/",
    "https://www.theblock.co/",
    "https://decrypt.co/",
    "https://www.researchgate.net/",
    "https://dev.to/",
    "https://github.com/",
    "https://www.somerleday.com/",
    "https://www.turing.com/blog/",
    "https://www.businessinsider.com/",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// Initialize the splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
});

// Function to check and create the collection if it doesn't exist
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    try {
        console.log("Checking if the collection exists...");
        const collections = await db.listCollections();
        const collectionNames = collections.map((col) => col.name);

        if (!collectionNames.includes(ASTRA_DB_COLLECTION)) {
            const res = await db.createCollection(ASTRA_DB_COLLECTION, {
                vector: {
                    dimension: 1536,
                    metric: similarityMetric,
                },
            });
            console.log("Collection created:", res);
        } else {
            console.log("Collection already exists. Skipping creation.");
        }
    } catch (error) {
        console.error("Error checking/creating collection:", error);
    }
};

// Function to scrape content from a given URL
const scrapePage = async (url: string): Promise<string> => {
    console.log(`Scraping page: ${url}...`);
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Add flags for faster launch
        },
        gotoOptions: {
            waitUntil: "domcontentloaded",
        },
    });

    try {
        const docs = await loader.load();
        return docs[0]?.pageContent || ""; // Return the content of the first document
    } catch (error) {
        console.error(`Error scraping the page (${url}):`, error);
        throw error; // Ensure the error propagates
    }
};

// Function to load and process sample data
const loadSampleData = async () => {
    try {
        const collection = db.collection(ASTRA_DB_COLLECTION); // Access the collection

        for (const url of ttData) {
            try {
                console.log(`Scraping content from URL: ${url}`);
                const content = await scrapePage(url);

                if (!content) {
                    console.warn(`No content found for URL: ${url}. Skipping...`);
                    continue;
                }

                console.log("Content scraped. Splitting into smaller chunks...");
                const chunks = await splitter.splitText(content);

                for (const chunk of chunks) {
                    try {
                        console.log(`Processing chunk: ${chunk.substring(0, 50)}...`);

                        // Check if the URL and chunk already exist in the database
                        const existingDoc = await collection.findOne({
                            source: url,
                            text: chunk, // Checking both the URL and the chunk text to avoid duplicates
                        });

                        if (existingDoc) {
                            console.log("Duplicate chunk found, skipping insertion.");
                            continue; // Skip this chunk if it's already in the database
                        }

                        // Proceed to create the vector embedding if it's not a duplicate
                        const embedding = await openai.embeddings.create({
                            model: "text-embedding-ada-002",
                            input: chunk,
                        });

                        const vector = embedding.data[0].embedding;

                        // Insert the chunk and vector into the database
                        const res = await collection.insertOne({
                            $vector: vector, // Store vector embedding
                            text: chunk,
                            source: url, // Track source URL
                            timestamp: new Date().toISOString(), // Track when data was added
                        });

                        console.log("Inserted chunk into database:", res);
                    } catch (chunkError) {
                        console.error("Error processing chunk:", chunkError);
                    }
                }
            } catch (urlError) {
                console.error(`Error processing URL (${url}):`, urlError);
            }
        }

        // After loading sample data, fetch and log the latest entries
        await getLatestEntries();

    } catch (mainError) {
        console.error("Error loading sample data:", mainError);
    }
};

// Function to fetch the latest entries from the database
const getLatestEntries = async () => {
    try {
        const collection = db.collection(ASTRA_DB_COLLECTION); // Access the collection
        const latestEntries = await collection.find({})  // Fetch all documents
            .sort({ timestamp: -1 })  // Sort by timestamp in descending order
            .limit(10)  // Limit to the latest 10 documents
            .toArray();  // Convert cursor to array

        console.log("Latest Entries:", latestEntries); // Log the result or process it as needed
        return latestEntries;
    } catch (error) {
        console.error("Error fetching latest entries:", error);
    }
};

// Execute the collection creation and sample data loading
createCollection()
    .then(() => loadSampleData())
    .then(() => console.log("All sample data processed successfully."))
    .catch((err) => console.error("An unexpected error occurred:", err));
