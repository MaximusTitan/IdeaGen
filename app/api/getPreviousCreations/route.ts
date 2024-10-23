import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { AIOutput } from '@/utils/Schema';
import { eq, and, SQL, sql } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const templateSlug = url.searchParams.get("templateSlug");
        const userEmail = url.searchParams.get("userEmail");

        if (!templateSlug || !userEmail) {
            return NextResponse.json({ error: "Invalid request." }, { status: 400 });
        }

        const previousCreations = await db
            .select()
            .from(AIOutput)
            .where(and(
                eq(AIOutput.templateslug, templateSlug),
                eq(AIOutput.useremail, userEmail)
            ))
            .orderBy(sql`${AIOutput.createdat} DESC`) // Cast to the correct type
            .limit(10); // Adjust the limit as needed

        return NextResponse.json({ data: previousCreations });
    } catch (error) {
        console.error("Failed to fetch previous creations:", error);
        return NextResponse.json({ error: "Failed to fetch previous creations." }, { status: 500 });
    }
}
