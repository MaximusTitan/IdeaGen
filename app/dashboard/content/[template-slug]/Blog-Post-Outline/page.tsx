"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api"; // Make sure to import your API function
import { saveAIOutput } from "@/utils/dbactions"; // Added import for saving to database
import { useUser } from "@clerk/nextjs";
import Modal from "@/components/ui/model";

interface PreviousCreation {
    inputdata: string;
    airesponse: string;
    createdat: string;
}

export default function BlogOutlineGenerator() {
  const [blogOutline, setBlogOutline] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Retrieve user details
  const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

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

  const fetchPreviousCreations = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const templateSlug = "blog-post-outline";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="h-screen overflow-auto flex flex-col items-center bg-black text-white">
    <div className="w-full  p-4">
        <h2 className="text-4xl font-bold mb-5 pb-2 text-center">
            Blog Post Outline Generator
        </h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Column - Form */}
          <div className="flex-1 md:max-w-[45%]">
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
        {/* Previous Creations Section */}
        <div className="mb-20 pt-6 pb-20">
          <h3 className="text-2xl font-semibold mt-4 mb-4 text-center">Previous Creations</h3>
            {previousCreations.length > 0 ? (
              <div className="overflow-y-auto" style={{ height: 'calc(100vh - 500px)' }}>
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

            {/* Modal with Back Button */}
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

