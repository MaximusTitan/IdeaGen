"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox"; // Update the import based on your structure
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

export default function ArticleGenerator() {
  const [articleTopic, setArticleTopic] = useState("");
  const [includeLinks, setIncludeLinks] = useState(false); // State for the checkbox
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Retrieve user details
  const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!articleTopic) {
      alert("Please provide a topic to generate the article.");
      return;
    }

    setIsLoading(true);

    // Modify the prompt based on checkbox
    const linkText = includeLinks 
      ? "Embed relevant external links directly into the words throughout the content where appropriate. Do not add a separate list of links." 
      : "Do not include any external links.";
    const prompt = `Write a detailed article on the topic: "${articleTopic}". The article should include an engaging introduction, a well-structured body with key points and explanations, and a conclusion. ${linkText} Ensure the content is informative and easy to read.`;
    console.log("Prompt:", prompt);

    try {
      const result = await generateResponse(prompt);
      console.log("Generated Article:", result);
      setOutput(result || 'No output generated. Please try again.');

      // Save to database
      const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown";
      const templateSlug = "article-generator";
      const createdAt = new Date().toISOString();

      await saveAIOutput(articleTopic, templateSlug, result, userEmail, createdAt);
      console.log("Article saved successfully");

    } catch (error) {
      console.error("Failed to generate content:", error);
      setOutput("Failed to generate content. Please try again.");
    }

    setIsLoading(false);
  };

  const fetchPreviousCreations = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const templateSlug = "article-generator";
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
            Article Writer
        </h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mb-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">
              Generate Articles
            </h3>
            <p className="text-gray-400 mb-6">
              AgentRED's Article Generator helps you create comprehensive articles on any topic quickly.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="articleTopic"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  ARTICLE TOPIC
                </label>
                <Input
                  id="articleTopic"
                  placeholder="Enter your article topic..."
                  value={articleTopic}
                  onChange={(e) => setArticleTopic(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeLinks"
                  checked={includeLinks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncludeLinks(e.target.checked)}
                  label="Include external links"
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
            <CardContent className="overflow-y-auto max-h-80"> {/* Fixed height for output section */}
              <p 
                className="text-white whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: output }}
              />
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
