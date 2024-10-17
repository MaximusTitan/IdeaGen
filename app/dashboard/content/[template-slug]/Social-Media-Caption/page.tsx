import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Ensure to import your API function
import { saveAIOutput } from "@/utils/dbactions"; // Import the database save function
import { useUser } from "@clerk/nextjs"; // Import Clerk user for email

export default function SocialMediaCaptionGenerator() {
  const [postTopic, setPostTopic] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Use Clerk user to get email

  const handleGenerate = async () => {
    if (!postTopic) {
      alert("Please provide a topic to generate captions and hashtags.");
      return;
    }

    setIsLoading(true);

    const prompt = `Generate a creative social media caption and relevant hashtags for: ${postTopic}`;
    console.log("Prompt:", prompt);

    const createdAt = new Date().toISOString();
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    try {
      const result = await generateResponse(prompt);
      console.log("Generated Caption and Hashtags:", result);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database
      await saveAIOutput(postTopic, 'Blog-topic-Generator', result , userEmail, createdAt);

      console.log("Data saved successfully");
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

  const handleBack = () => {
    router.back(); // This will take the user to the previous page
  };

  return (
    <div className="h-screen overflow-auto flex flex-col items-center bg-black text-white">
      <div className="w-full  p-4">
        <h2 className="text-4xl font-bold mb-4 pb-2 text-center">
          Social Media Caption & Hashtag Generator
        </h2>

        <Button onClick={handleBack} className="mb-6">
          Back
        </Button>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">
              Generate Social Media Captions
            </h3>
            <p className="text-gray-400 mb-6">
              Create engaging captions and trending hashtags for your social media posts effortlessly. Just provide a topic, and let the AI handle the rest!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="postTopic"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  POST TOPIC
                </label>
                <Input
                  id="postTopic"
                  placeholder="Enter your post topic..."
                  value={postTopic}
                  onChange={(e) => setPostTopic(e.target.value)}
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
              <p className="text-gray-500 whitespace-pre-line">
                {output || "Your generated captions and hashtags will appear here."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
