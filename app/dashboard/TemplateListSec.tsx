import React from 'react';
import { useRouter } from 'next/navigation'; // Adjust import if using older versions of Next.js
import { Package, BookOpen, Video, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TemplateListSec({ UserSearchInput }: any) {
  const router = useRouter();

  const templates = [
    { 
      icon: Package, 
      title: "Product Description Generator", 
      description: "Create compelling and SEO-optimized product descriptions effortlessly. Just provide a few details, and let the AI craft engaging content that drives sales.", 
      slug: "product-description"
    },
    { 
      icon: BookOpen, 
      title: "Blog Topic Generator", 
      description: "Struggling with writer’s block? Get fresh, trending blog topics and detailed outlines tailored to your audience with just a few keywords.", 
      slug: "blog-topic" 
    },
    { 
      icon: Video, 
      title: "Video Script Generator for YouTube", 
      description: "Generate complete video scripts for YouTube, including intros, main points, and engaging conclusions. Perfect for creating professional, audience-focused content.", 
      slug: "video-script" 
    },
    { 
      icon: Hash, 
      title: "Social Media Caption & Hashtag Optimizer", 
      description: "Craft catchy captions and discover trending hashtags for Instagram, Twitter, and Facebook. Enhance your posts' reach with AI-powered suggestions.", 
      slug: "social-media-caption" 
    },
  ];

  // Filter templates based on search input
const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes((UserSearchInput || "").toLowerCase())
  );
  

  const handleCardClick = (slug: string) => {
    router.push(`/dashboard/content/${slug}`);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {filteredTemplates.map(({ icon: Icon, title, description, slug }, index) => (
          <Card
            key={index}
            className="bg-gray-900 border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:bg-gray-800 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick(slug)}
          >
            <CardHeader className="flex-grow">
              <div className="flex items-center space-x-2">
                <Icon className="h-6 w-6 text-blue-400 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-300" />
                <CardTitle className="text-sm font-bold text-white leading-tight transition-colors duration-300 group-hover:text-blue-300">
                  {title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TemplateListSec;
