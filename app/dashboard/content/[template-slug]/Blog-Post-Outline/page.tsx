"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Make sure to import your API function
import { saveAIOutput } from "@/utils/dbactions"; // Added import for saving to database
import { useUser } from "@clerk/nextjs";

export default function BlogOutlineGenerator() {
  const [blogOutline, setBlogOutline] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Retrieve user details

  const handleGenerate = async () => {
    if (!blogOutline) {
      alert("Please provide a blog topic to generate the Blog Outline.");
      return;
    }

    setIsLoading(true);

    const prompt = `Create a detailed blog post outline for the topic: "${blogOutline}". The outline should include a catchy title, a brief introduction, main points with subheadings, and a conclusion. Ensure the content is engaging and easy to follow.`;
    console.log("Prompt:", prompt);
    

    try {
      const result = await generateResponse(prompt);
      console.log("Generated Blog Outline:", result);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database - Added this part
      const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown";
      const templateSlug = "blog-post-outline";
      const createdAt = new Date().toISOString();

      await saveAIOutput(blogOutline, templateSlug, result, userEmail, createdAt);
      console.log("Blog outline saved successfully");

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
          Blog Post Outline Generator
        </h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">
              Generate Blog Post Outlines
            </h3>
            <p className="text-gray-400 mb-6">
              AgentRED's Blog Post Outline Generator helps you create engaging post outlines fast. 
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="blogTopic"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  BLOG TOPIC
                </label>
                <Input
                  id="blogTopic"
                  placeholder="Enter your blog topic..."
                  value={blogOutline}
                  onChange={(e) => setBlogOutline(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? 'Generating...' : 'Generate'}
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
