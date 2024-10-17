"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Import Clerk user for authentication

const LandingPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    if (user) {
      // Set a timer to redirect after a delay
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        router.push("/dashboard");
      }, 60000); // Delay of 3 seconds

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to AI Content Generator</h1>
      <p className="text-lg mb-6 text-center px-4">
        Create high-quality content with ease! Our AI-powered tools will help you generate everything from product descriptions to video scripts.
      </p>
    
      <div className="flex flex-col md:flex-row md:space-x-4">
        <Button onClick={() => router.push("/dashboard")} className="mb-2 md:mb-0">
          Go Create
        </Button>
        <Button onClick={() => router.push("/about")} className="bg-gray-700 hover:bg-gray-600">
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
