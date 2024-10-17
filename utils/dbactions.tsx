import { db } from './db';
import { AIOutput } from './Schema';
import { sql } from 'drizzle-orm';

// Function to insert data into AIOutput table
export const saveAIOutput = async (inputData: string, templateSlug: string, aiResponse: string, useremail: string, createdAt: string) => {
    try {
        await db.insert(AIOutput).values({
            inputdata: inputData,
            templateslug: templateSlug,
            airesponse: aiResponse,
            useremail: useremail, // Ensure this matches your schema field
            createdat: createdAt,
        }).execute();
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};

// Function to fetch all outputs (example)
export async function getAIOutputs() {
    try {
        const outputs = await db.select().from(AIOutput).execute();
        return outputs;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
