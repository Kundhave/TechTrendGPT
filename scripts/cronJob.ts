import cron from "node-cron";
import { loadSampleData } from "./loadDB";

// Schedule the cron job (e.g., runs daily at midnight)
cron.schedule("0 0 * * *", async () => {
    console.log("Running the daily scrape job...");
    try {
        await loadSampleData();
        console.log("Daily scrape job completed successfully.");
    } catch (error) {
        console.error("Error during daily cron job:", error);
    }
});

console.log("Cron job has been scheduled.");