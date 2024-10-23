"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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



export default function ProductDescriptionPage() {
    const [productName, setProductName] = useState("");
    const [productInfo, setProductInfo] = useState("");
    const [output, setOutput] = useState("");
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false); // Add this line
    const [previousCreations, setPreviousCreations] = useState<PreviousCreation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string | null>(null);



    const handleGenerate = async () => {
        setIsLoading(true); 
        try {
            const prompt = `Product Name: ${productName}\nProduct Information: ${productInfo}`;
            console.log("Prompt:", prompt);

            const result = await generateResponse(prompt);
            console.log("Generated Product Description:", result);

            setOutput(result);

            // Ensure each save is independent and check email
            const createdAt = new Date().toISOString();
            const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';
            
            if (userEmail) {
                console.log("User Email:", userEmail);
                await saveAIOutput(productName, "product-description", result, userEmail, createdAt);
                console.log("Data saved successfully");
            } else {
                console.error("User email not found. Data not saved.");
            }

        } catch (error) {
            console.error("Failed to generate content:", error);
            setOutput("Failed to generate content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPreviousCreations = async () => {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!userEmail) return;
    
        const templateSlug = "product-description";
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
                    Product Description Generator
                </h2>

                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                    {/* Left Column - Form */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4">
                            Generate Product Description
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Create compelling and SEO-optimized product descriptions effortlessly.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="productName"
                                    className="block text-sm font-medium text-gray-400 mb-1"
                                >
                                    PRODUCT NAME
                                </label>
                                <Input
                                    id="productName"
                                    placeholder="Name of the Product..."
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="productInfo"
                                    className="block text-sm font-medium text-gray-400 mb-1"
                                >
                                    PRODUCT INFORMATION
                                </label>
                                <Textarea
                                    id="productInfo"
                                    placeholder="Need more information of Product..."
                                    value={productInfo}
                                    onChange={(e) => setProductInfo(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    rows={4}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                            {isLoading ? 'Generating...' : 'Generate'}
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
                                {output || "Your generated product description will appear here."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                {/* Previous Creations Section */}
            <div className="mt-8 pb-20 mb-20">
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
