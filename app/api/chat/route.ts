import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { fetchLatestTechNews, formatNewsArticles, isNewsQuery } from "@/app/utils/newsApi";
import { formatResponseForMobile } from "@/app/utils/responseFormatter";

const {
    ASTRA_DB_NAMESPACE = "",
    ASTRA_DB_COLLECTION = "",
    ASTRA_DB_API_ENDPOINT = "",
    ASTRA_DB_APPLICATION_TOKEN = "",
    OPENAI_API_KEY = "",
} = process.env;

// Check for missing required environment variables.
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN || !OPENAI_API_KEY) {
    throw new Error("Missing required environment variables");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// Helper function to determine query type (time-sensitive or evergreen)
function determineQueryType(query: string): string {
    const latestKeywords = ['latest', 'improvements', 'trends', 'new', 'recent'];
    const evergreenKeywords = ['what is', 'define', 'explain', 'how to'];

    const isTimeSensitive = latestKeywords.some((keyword) => query.toLowerCase().includes(keyword));
    const isEvergreen = evergreenKeywords.some((keyword) => query.toLowerCase().includes(keyword));

    if (isTimeSensitive) {
        return 'time-sensitive';
    } else if (isEvergreen) {
        return 'evergreen';
    } else {
        return 'generic';  // Default case if it's unclear.
    }
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content;

        // Return a response if no message is provided.
        if (!latestMessage) {
            return new Response("No message provided", { status: 400 });
        }

        let docContext = "";
        let newsContext = "";

        // Check if the query is asking for recent tech news
        if (isNewsQuery(latestMessage)) {
            try {
                // Extract the number of articles requested (default to 5)
                const countMatch = latestMessage.match(/\d+/);
                const count = countMatch ? parseInt(countMatch[0]) : 5;
                
                // Fetch the latest tech news
                const newsArticles = await fetchLatestTechNews(count);
                newsContext = formatNewsArticles(newsArticles);
                
                console.log("Fetched real-time tech news for query");
            } catch (error) {
                console.error("Error fetching tech news:", error);
                newsContext = "I couldn't fetch the latest tech news at the moment.";
            }
        }

        try {
            // Generate embeddings for the user's latest message.
            const embedding = await openai.embeddings.create({
                model: "text-embedding-ada-002", // Ensure a supported embedding model is used.
                input: latestMessage,
                encoding_format: "float",
            });

            const collection = db.collection(ASTRA_DB_COLLECTION); // Remove `await`

            // Determine if the query is time-sensitive or evergreen
            const queryType = determineQueryType(latestMessage);

            let cursor;
            if (queryType === 'time-sensitive') {
                // Apply time filter for the last 7 days
                cursor = collection.find(
                    { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() } },
                    {
                        sort: { $vector: embedding.data[0].embedding },
                        limit: 10,
                    }
                );
            } else {
                // For evergreen or generic queries, no time filter
                cursor = collection.find(
                    {},
                    {
                        sort: { $vector: embedding.data[0].embedding },
                        limit: 10,
                    }
                );
            }

            const documents = await cursor.toArray();

            // Concatenate the text content of retrieved documents.
            const rawText = documents.map((doc) => doc.text).join(" ");

            docContext = rawText || "No relevant context found in the database."; // Use rawText directly

        } catch (err) {
            console.error("Error querying the database:", err);
            docContext = "A problem occurred while retrieving the context. However, I'll do my best to assist you.";
        }

        // Build the system message template.
        const template = {
            role: "system",
            content: `You are TechTrendGPT, an AI assistant specializing in the latest technology trends, AI advancements, cybersecurity, and digital innovations. Your knowledge is based on current, cutting-edge developments and expert insights.

    ${newsContext ? `Here is the latest tech news to help you provide up-to-date information:
    -------------------
    ${newsContext}
    -------------------` : ''}

    Here is a summarized context to help you provide insightful and up-to-date responses:
    -------------------
    ${docContext}
    -------------------
    QUESTION: ${latestMessage}

    Please respond in a clear, concise, and informative manner, considering the most recent trends, innovations, and technological advancements. If the query is about a general topic, provide foundational knowledge with relevant, accessible details.
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    1. Use clear, bold headings for each major point.
    2. Keep paragraphs short and use bullet points where relevant.
    3. Include sufficient white space between sections.
    4. Structure your response to be easily readable on mobile devices.
    5. Ensure sections are clearly separated.
    6. Avoid overwhelming users with too much text at once.
    7. Format your response to be mobile-friendly and user-friendly.`,
        };

        // Create a ChatGPT completion using OpenAI's GPT-4 model with streaming enabled.
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            stream: true,
            messages: [template, ...messages],
        });

        // Stream the ChatGPT response back to the frontend.
        const stream = OpenAIStream(completion as unknown as Response);
        return new StreamingTextResponse(stream);
    } catch (err) {
        console.error("Error processing the request:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
