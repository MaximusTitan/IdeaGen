"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/utils/gemini-Api";
import { saveAIOutput } from "@/utils/dbactions"; // Import the database save function
import { useUser } from "@clerk/nextjs"; // Import Clerk user for email
import Modal from "@/components/ui/model";

interface PreviousCreation {
  inputdata: string;
  airesponse: string;
  createdat: string;
}

const VideoScriptGenerator: React.FC = () => {
  const [videoTopic, setVideoTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [scriptStyle, setScriptStyle] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Use Clerk user to get email
  const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

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

  const fetchPreviousCreations = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const templateSlug = "Video-Script-Generator";
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

export default VideoScriptGenerator;
