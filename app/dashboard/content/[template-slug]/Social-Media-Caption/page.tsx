"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Ensure to import your API function
import { saveAIOutput } from "@/utils/dbactions"; // Import the database save function
import { useUser } from "@clerk/nextjs"; // Import Clerk user for email
import Modal from "@/components/ui/model";
import { ArrowLeft } from "lucide-react";

interface PreviousCreation {
  inputdata: string;
  airesponse: string;
  createdat: string;
}

export default function SocialMediaCaptionGenerator() {
  const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
  const [postTopic, setPostTopic] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const { user } = useUser(); // Use Clerk user to get email

  const handleGenerate = async () => {
    if (!postTopic) {
      alert("Please provide a topic to generate captions and hashtags.");
      return;
    }

    setIsLoading(true);

    const prompt = `Generate a creative and catchy social media caption and relevant hashtags for: ${postTopic}`;
    console.log("Prompt:", prompt);

    const createdAt = new Date().toISOString();
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    try {
      const result = await generateResponse(prompt);
      console.log("Generated Caption and Hashtags:", result);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database
      await saveAIOutput(postTopic, 'social-media-caption-generator', result , userEmail, createdAt);

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Failed to generate content:", error);
      setOutput("Failed to generate content. Please try again.");
    }

    setIsLoading(false);
  };

  const handleGoBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  const fetchPreviousCreations = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const templateSlug = "social-media-caption-generator"; // Use the correct slug for your template
    try {
      const response = await fetch(`/api/getPreviousCreations?templateSlug=${templateSlug}&userEmail=${userEmail}`);
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching previous creations:", data.error);
      } else {
        setPreviousCreations(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch previous creations:", error);
    }
  };

  useEffect(() => {
    fetchPreviousCreations();
  }, [user]);

  return (
    <div className="h-screen overflow-auto flex flex-col items-center bg-black text-white">
    <div className="w-full  p-4">
        <h2 className="text-4xl font-bold mb-5 pb-2 text-center">
            Social Media Caption and Hashtag Generator
        </h2>

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
          <Card className="flex-1 bg-gray-900 border-gray-700 overflow-y-auto max-h-[60vh]">
            <CardHeader>
              <CardTitle className="text-white text-base text-center">
                Output
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              <p className="text-white whitespace-pre-line">
                {output || "Your generated captions and hashtags will appear here."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Previous Creations Section */}
        <div className="mb-20 pt-6 pb-20">
          <h3 className="text-2xl font-semibold mt-4 mb-4 text-center">Previous Creations</h3>
          {previousCreations.length > 0 ? (
            <table className="w-full bg-black text-white">
              <thead>
                <tr>
                  <th className="p-2 text-left">Prompt</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2">View</th>
                </tr>
              </thead>
              <tbody>
                {previousCreations.map((creation, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2">{creation.inputdata}</td>
                    <td className="p-2">{new Date(creation.createdat).toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <Button variant="link" onClick={() => {
                        setModalContent(creation.airesponse);
                        setIsModalOpen(true);
                      }} className="text-white">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No previous creations found.</p>
          )}
        </div>

        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="relative p-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2"
            >
              &#8592;
            </Button>
            <h3 className="text-xl font-bold mb-4 text-center">Previous Content</h3>
            <p className="text-white whitespace-pre-line overflow-y-auto max-h-80">
              {modalContent}
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}