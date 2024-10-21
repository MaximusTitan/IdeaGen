"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import  Checkbox  from "@/components/ui/checkbox"; // Make sure to import the checkbox you created
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Ensure this points to your API function
import { saveAIOutput } from "@/utils/dbactions"; // Added import for saving to database
import { useUser } from "@clerk/nextjs";

export default function NewsletterGenerator() {
  const [inputText, setInputText] = useState(""); // To hold user input
  const [includeLinks, setIncludeLinks] = useState(false); // State for the checkbox
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Retrieve user details

  const handleGenerate = async () => {
    if (!inputText) {
      alert("Please provide points to convey, article URL, or YouTube video URL.");
      return;
    }

    setIsLoading(true);

    // Modify the prompt based on checkbox
    const linkText = includeLinks 
      ? "Embed relevant external links directly into the words or phrases throughout the content where appropriate. Do not add a separate list of links." 
      : "Do not include any external links.";
    
    const prompt = `Create a newsletter based on the following input: "${inputText}". ${linkText} Ensure the content is engaging and well-structured.`;
    console.log("Prompt:", prompt);

    try {
      const result = await generateResponse(prompt);
      console.log("Generated Newsletter:", result);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database
      const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown";
      const templateSlug = "newsletter-generator";
      const createdAt = new Date().toISOString();

      await saveAIOutput(inputText, templateSlug, result, userEmail, createdAt);
      console.log("Newsletter saved successfully");

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
          Newsletter Generator
        </h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">
              Generate Newsletters
            </h3>
            <p className="text-gray-400 mb-6">
              IdeaGen's Newsletter Generator helps you create engaging newsletters from various inputs.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newsletterInput"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Points to Convey / Article Url / Youtube Video URL 
                </label>
                <Input
                  id="newsletterInput"
                  placeholder="Enter your points, article URL, or YouTube URL..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              {/* Checkbox for Including Links */}
              <Checkbox
                id="includeLinks"
                checked={includeLinks}
                onChange={(e) => setIncludeLinks(e.target.checked)}
                label="Include external links"
              />
              
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
              <p 
                className="text-white whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: output }} // Use for rendering HTML content
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
