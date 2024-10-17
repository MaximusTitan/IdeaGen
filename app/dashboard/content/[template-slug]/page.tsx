"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDescriptionPage from './ProductDescription/page';
import BlogTopicGenerator from './Blog-Topic/page';
import VideoScriptGenerator from './Video-Script/page';
import SocialMediaGenerator from './Social-Media-Caption/page';
import { ArrowLeft } from 'lucide-react';


function TemplatePage() {
  const params = useParams();
  const templateSlug = params['template-slug'];

  const templateNames = {
    'product-description': 'Product Description Generator',
    'blog-topic': 'Blog Topic Generator',
    'video-script': 'Video Script Generator for YouTube',
    'social-media-caption': 'Social Media Caption & Hashtag Optimizer'
  };

  const renderContent = () => {
    switch (templateSlug) {
      case 'product-description':
        return <ProductDescriptionPage/>;
      case 'blog-topic':
        return <BlogTopicGenerator/>;
      case 'video-script':
        return <VideoScriptGenerator/>;
      case 'social-media-caption':
        return <SocialMediaGenerator/>;
      default:
        return <p>Template not found.</p>;
    }
  };

  return (
    
    <div className="p-2">
     
      <div>
        {renderContent()}
      </div>
    </div>
    
  );
}

export default TemplatePage;
