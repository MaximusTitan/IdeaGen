"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDescriptionPage from './ProductDescription/page';
import BlogTopicGenerator from './Blog-Topic/page';
import VideoScriptGenerator from './Video-Script/page';
import SocialMediaGenerator from './Social-Media-Caption/page';
import BlogOutlineGenerator from './Blog-Post-Outline/page';
import ArticleWriterGenerator from './Article-Writer/page';
import NewsletterGenerator from './NewsLetter-Generator/page';
import SmartSuggestGenerator from './Smart-Suggest/page';
import { ArrowLeft } from 'lucide-react';

function TemplatePage() {
  const params = useParams();
  const templateSlug = params['template-slug'];
  
  console.log("Template Slug:", templateSlug); // Debugging log

  const templateNames = {
    'product-description': 'Product Description Generator',
    'blog-topic': 'Blog Topic Generator',
    'video-script': 'Video Script Generator for YouTube',
    'social-media-caption': 'Social Media Caption & Hashtag Optimizer',
    'blog-post-outline': 'Blog Post Outline Generator',
    'article-writer': 'Article Writer Generator',
    'newsletter': 'Newsletter Generator',
    'smart-suggest' : 'Smart Suggest Tool'// Correct slug name here
  };

  const renderContent = () => {
    switch (templateSlug) {
      case 'product-description':
        return <ProductDescriptionPage />;
      case 'blog-topic':
        return <BlogTopicGenerator />;
      case 'video-script':
        return <VideoScriptGenerator />;
      case 'social-media-caption':
        return <SocialMediaGenerator />;
      case 'blog-post-outline':
        return <BlogOutlineGenerator />;
      case 'article-writer':
        return <ArticleWriterGenerator />;
      case 'newsletter-generator':
        return <NewsletterGenerator />;
      case 'Smart-Suggest-Tool':
        return <SmartSuggestGenerator/>
      default:
        return <p>Template not found.</p>;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center">
        <ArrowLeft className="cursor-pointer mr-4" onClick={() => history.back()} />
      </div>
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default TemplatePage;
