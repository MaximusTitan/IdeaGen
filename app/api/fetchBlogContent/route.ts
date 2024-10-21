import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        // Validate URL
        if (!url) {
            return NextResponse.json({ error: "URL is required." }, { status: 400 });
        }

        // Fetch the blog content from the URL
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error("Failed to fetch blog content.");
        }

        // Get the response body as text
        const data = await response.text();

        // You might want to do some parsing here to extract content
        // For demonstration, we assume you return the full text
        return NextResponse.json({ content: data });
    } catch (error) {
        const errorMessage = (error as Error).message || "Failed to fetch blog content."; // Type assertion
        console.error("Error fetching blog content:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
