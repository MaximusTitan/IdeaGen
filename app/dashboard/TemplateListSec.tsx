"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, BookOpen, Video, Hash } from "lucide-react";

export default function TemplateListSec() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {[
          { icon: Package, title: "Product Description Generator", description: "Create compelling and SEO-optimized product descriptions effortlessly. Just provide a few details, and let the AI craft engaging content that drives sales.", path: "/dashboard/content/product-description" },
          { icon: BookOpen, title: "Blog Topic Generator", description: "Struggling with writer’s block? Get fresh, trending blog topics and detailed outlines tailored to your audience with just a few  keywords.", path: "/dashboard/content/blog-topic" },
          { icon: Video, title: "Video Script Generator for YouTube", description: "Generate complete video scripts for YouTube, including intros, main points, and engaging conclusions. Perfect for creating professional, audience-focused content.", path: "/dashboard/content/video-script" },
          { icon: Hash, title: "Social Media Caption & Hashtag Optimizer", description: "Craft catchy captions and discover trending hashtags for Instagram, Twitter, and Facebook. Enhance your posts' reach with AI-powered suggestions.", path: "/dashboard/content/social-media-caption" },
        ].map(({ icon: Icon, title, description, path }, index) => (
          <Link href={path} key={index}>
            <Card
              className="bg-gray-900 border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:bg-gray-800 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex-grow">
                <div className="flex items-center space-x-2">
                  <Icon className="h-6 w-6 text-blue-400 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-300" />
                  <CardTitle className="text-sm font-bold text-white leading-tight transition-colors duration-300 group-hover:text-blue-300">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
              <p className="text-xs text-gray-400">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
