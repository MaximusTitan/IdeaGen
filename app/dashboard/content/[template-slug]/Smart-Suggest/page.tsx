"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api";
import { saveAIOutput } from "@/utils/dbactions";
import { useUser } from "@clerk/nextjs";
import Modal from "@/components/ui/model";

interface PreviousCreation {
  inputdata: string;
  airesponse: string;
  createdat: string;
}

export default function SmartSuggestGenerator() {
  const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
  const [blogUrl, setBlogUrl] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const handleGenerate = async () => {
    if (!blogUrl) {
      alert("Please provide a valid blog URL.");
      return;
    }

    let formattedUrl = blogUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsLoading(true);

    try {
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
      const prompt = `Generate a list of creative and catchy blog post titles based on the following content: "${content}".`;

      const result = await generateResponse(prompt);
      setOutput(result || "No suggestions generated. Please try again.");

      const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown";
      const templateSlug = "smart-suggest-tool";
      const createdAt = new Date().toISOString();

      await saveAIOutput(blogUrl, templateSlug, result, userEmail, createdAt);
    } catch (error) {
      setOutput("Failed to generate content. Please try again.");
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  const fetchPreviousCreations = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const templateSlug = "smart-suggest-tool";
    try {
      const response = await fetch(`/api/getPreviousCreations?templateSlug=${templateSlug}&userEmail=${userEmail}`);
      const data = await response.json();

      if (!data.error) {
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
      <div className="w-full p-4">
        <h2 className="text-4xl font-bold mb-4 pb-2 text-center">
          Smart Suggest Tool
        </h2>
        
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                    {/* Left Column - Form */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4">
                            Generate Blog Post Titles
                        </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Enter your blog's URL..."
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white w-full"
              />
              <Button type="submit" className="w-full">
                {isLoading ? 'Generating...' : 'Generate Ideas'}
              </Button>
            </form>
          </div>

          <Card className="flex-1 bg-gray-900 border-gray-700 "> {/* Added max-width for output section */}
            <CardHeader>
              <CardTitle className="text-white text-base text-center">Output</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              <p className="text-white whitespace-pre-line">{output || "Your generated blog titles will appear here."}</p>
            </CardContent>
          </Card>
        </div>

         {/* Previous Creations Section */}
         <div className="mb-20 pt-6 pb-20"> {/* Changed margin */}
          <h3 className="text-2xl font-semibold mb-4 text-center">Previous Creations</h3>
          {previousCreations.length > 0 ? (
            <div className="overflow-y-auto border border-gray-700 rounded-lg" style={{ height: '400px' }}> {/* Fixed height for consistency */}
              <table className="w-full bg-black text-white">
                <thead className="sticky top-0 bg-black z-10">
                  <tr>
                    <th className="p-2 text-left">Prompt</th>
                    <th className="p-2 text-left">Created</th>
                    <th className="p-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {previousCreations.map((creation, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-900 transition-colors">
                      <td className="p-2">{creation.inputdata}</td>
                      <td className="p-2">{new Date(creation.createdat).toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <Button
                          variant="link"
                          onClick={() => {
                            setModalContent(creation.airesponse);
                            setIsModalOpen(true);
                          }}
                          className="text-white hover:text-blue-400"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center">No previous creations found.</p>
          )}
        </div>

        {/* Modal */}
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
