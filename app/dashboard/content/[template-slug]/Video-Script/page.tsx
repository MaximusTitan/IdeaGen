"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api";
import { saveAIOutput } from "@/utils/dbactions"; // Import the database save function
import { useUser } from "@clerk/nextjs"; // Import Clerk user for email

const VideoScriptGenerator: React.FC = () => {
  const [videoTopic, setVideoTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [scriptStyle, setScriptStyle] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Use Clerk user to get email

  const handleGenerate = async () => {
    if (!videoTopic || !targetAudience ) {
      alert("Please provide all inputs to generate the video script.");
      return;
    }

    setIsLoading(true);

    const inputDetails = `
    Generate a video script with the following details:
    - Video Topic: ${videoTopic}
    - Target Audience: ${targetAudience}
    - Script Style: ${scriptStyle}
    `;
    const createdAt = new Date().toISOString();
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    try {
      const result = await generateResponse(inputDetails);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database
      await saveAIOutput(videoTopic, 'Video-Script-Generator', result, userEmail, createdAt);

      console.log("Data saved successfully");
    } catch (error) {
      setOutput('An error occurred while generating the video script.');
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="h-screen overflow-auto flex flex-col items-center bg-black text-white">
      <div className="w-full p-4">
        <h2 className="text-4xl font-bold mb-2 text-center">
          Video Script Generator
        </h2>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6"> 
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2">
              Generate Video Script
            </h3>
            <p className="text-gray-400 mb-2">
              Create engaging video scripts with just a few details. Fill in the fields below, and let the AI generate a compelling script tailored to your needs.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="video-topic"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  VIDEO TOPIC
                </label>
                <Input
                  id="video-topic"
                  placeholder="Enter the topic of the video..."
                  value={videoTopic}
                  onChange={(e) => setVideoTopic(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="target-audience"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  TARGET AUDIENCE
                </label>
                <Input
                  id="target-audience"
                  placeholder="Who is the target audience?"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="script-style"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  SCRIPT STYLE (Optional)
                </label>
                <Textarea
                  id="script-style"
                  placeholder="Describe the style of the script you want."
                  value={scriptStyle}
                  onChange={(e) => setScriptStyle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Video Script'}
              </Button>
            </form>
          </div>

          {/* Right Column - Output */}
          <Card className="flex-1 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base text-center">
                Output
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              <p className="text-white whitespace-pre-line">
                {output || "Your generated video script will appear here."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoScriptGenerator;
