"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Make sure to import your API function
import { saveAIOutput } from "@/utils/dbactions"; // Added import for saving to database
import { useUser } from "@clerk/nextjs";

export default function SmartSuggestGenerator() {
  const [blogUrl, setBlogUrl] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Retrieve user details

  const handleGenerate = async () => {
    if (!blogUrl) {
      alert("Please provide a valid blog URL.");
      return;
    }
  
    // Ensure the URL is properly formatted
    let formattedUrl = blogUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
  
    setIsLoading(true);
  
    try {
      // Step 1: Fetch the blog content from the API
      const response = await fetch("/api/fetchBlogContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch blog content.");
      }
  
      const { content } = await response.json();
      console.log("Fetched Blog Content:", content); // Log the fetched content
  
      // Step 2: Use the fetched content to generate blog post ideas
      const prompt = `Generate a list of creative and catchy blog post titles based on the following content: "${content}". Generate atleast 20 titles and Each title should be engaging and formatted like a headline, without any additional explanations or context. And please don't say this line Here are some creative and catchy blog post titles based on the provided HTML code, instead say Here are some creative and catchy blog post title: `;
      console.log("Prompt:", prompt);
  
      const result = await generateResponse(prompt);
      console.log("Generated Suggestions:", result);
      setOutput(result || "No suggestions generated. Please try again.");
  
      // Save to database
      const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown";
      const templateSlug = "smart-suggest-tool"; // Adjust the slug as necessary
      const createdAt = new Date().toISOString();
  
      await saveAIOutput(blogUrl, templateSlug, result, userEmail, createdAt);
      console.log("Blog suggestions saved successfully");
  
    } catch (error) {
      console.error("Failed to generate content:", error);
      setOutput("Failed to generate content. Please try again.");
    }
  
    setIsLoading(false);
  };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleGenerate();
    };

  return (
    <div className="h-screen overflow-auto flex flex-col items-center bg-black text-white">
      <div className="w-full max-w-5xl p-4">
        <h2 className="text-4xl font-bold mb-4 pb-2 text-center">
          Smart Suggest Tool
        </h2>
        
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">
              Generate Blog Post Ideas
            </h3>
            <p className="text-gray-400 mb-6">
              Enter your blog's URL to generate a list of potential blog post ideas based on your existing content.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="blogUrl"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  BLOG URL
                </label>
                <Input
                  id="blogUrl"
                  placeholder="Enter your blog's URL..."
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? 'Generating...' : 'Generate Ideas'}
              </Button>
            </form>
          </div>

          {/* Right Column - Output */}
          <Card className="flex-1 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base text-center">
                Output
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              <p className="text-white whitespace-pre-line">
                {output || "Your generated blog titles will appear here."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
