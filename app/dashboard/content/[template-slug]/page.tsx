"use client"

import React from 'react';
import { useParams } from 'next/navigation';

function TemplatePage() {
  const params = useParams();
  const templateSlug = params['template-slug']

  const templateNames = {
    'product-description': 'Product Description Generator',
    'blog-topic': 'Blog Topic Generator',
    'video-script': 'Video Script Generator for YouTube',
    'social-media-caption': 'Social Media Caption & Hashtag Optimizer'
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        {templateNames[templateSlug as keyof typeof templateNames] || 'Template'}
      </h1>
      <p className="mt-4">This is the page for {templateSlug}.</p>
      {/* Add the actual template functionality here */}
    </div>
  );
}

export default TemplatePage;
