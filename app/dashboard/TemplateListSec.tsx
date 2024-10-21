"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BookOpen, Video, Hash, Mail, Camera, Calendar, FileText, ChevronDown, ScanBarcodeIcon, NewspaperIcon, LetterTextIcon } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import SearchSection from "./SearchSection";

export default function TemplateListSec() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  const onSearch = (query: string) => {
    setSearchTerm(query); // Update the search term state
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        setShowScrollIndicator(scrollTop < scrollHeight - clientHeight - 20);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const templates = [
    {
      icon: Package,
      title: "Product Description Generator",
      description: "Create compelling and SEO-optimized product descriptions effortlessly.",
      path: "/dashboard/content/product-description"
    },
    {
      icon: BookOpen,
      title: "Blog Topic Generator",
      description: "Get fresh, trending blog topics and detailed outlines tailored to your audience.",
      path: "/dashboard/content/blog-topic"
    },
    {
      icon: Video,
      title: "Video Script Generator for YouTube",
      description: "Generate complete video scripts for YouTube, including engaging conclusions.",
      path: "/dashboard/content/video-script"
    },
    {
      icon: Hash,
      title: "Social Media Caption & Hashtag Optimizer",
      description: "Craft catchy captions and discover trending hashtags for various platforms.",
      path: "/dashboard/content/social-media-caption"
    },
    {
      icon: LetterTextIcon,
      title: "Blog Post Outline Generator",
      description: "IdeaGen's Blog Post Outline Generator helps you create engaging post outlines fast. ",
      path: "/dashboard/content/blog-post-outline"
    },
    {
      icon: FileText,
      title: "Article Writer",
      description: "IdeaGen's AI-powered Article Writer will generate an outline for your topic or keyword.",
      path: "/dashboard/content/article-writer"
    },
    {
      icon: NewspaperIcon,
      title: "Newsletter Generator",
      description: "Plan your content strategy with AI-generated ideas for each day of the month.",
      path: "/dashboard/content/newsletter-generator"
    },
    {
      icon: ScanBarcodeIcon,
      title: "Smart Suggest Tool",
      description: "IdeaGen's Smart Suggest scans your blog's content and generates a list of blog post ideas based on your existing content.",
      path: "/dashboard/content/Smart-Suggest-Tool"
    },
    // ... (other template items)
  ];

  // Filter templates based on the search term
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div ref={scrollContainerRef} className="w-full max-w-[90%] h-[calc(100vh-100px)] overflow-y-auto px-4">
        <SearchSection onSearch={onSearch} />
        <div className="grid grid-cols-3 gap-6 pb-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(({ icon: Icon, title, description, path }, index) => (
              <Link href={path} key={index}>
                <Card className="bg-gray-900 border-gray-700 flex flex-col h-full transition-all duration-300 ease-in-out hover:bg-gray-800 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex-grow p-4 pb-2">
                    <div className="flex items-center space-x-3 mb-1">
                      <Icon className="h-6 w-6 text-blue-400 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-300" />
                      <CardTitle className="text-lg font-bold text-white leading-tight transition-colors duration-300 group-hover:text-blue-300">{title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-400">{description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-white">No templates found.</div>
          )}
        </div>
      </div>
      {showScrollIndicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}
