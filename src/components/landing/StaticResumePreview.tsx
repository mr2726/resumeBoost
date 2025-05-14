
'use client';

import type { GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import ResumeDisplay from '@/components/resume/ResumeDisplay';
import React from 'react';

interface StaticResumePreviewProps {
  resumeData: GenerateResumeContentOutput;
}

export default function StaticResumePreview({ resumeData }: StaticResumePreviewProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="shadow-xl rounded-lg overflow-hidden relative 
                 w-[calc(794px*0.35)] h-[calc(1123px*0.35)] 
                 sm:w-[calc(794px*0.45)] sm:h-[calc(1123px*0.45)] 
                 md:w-[calc(794px*0.4)] md:h-[calc(1123px*0.4)] 
                 lg:w-[calc(794px*0.5)] lg:h-[calc(1123px*0.5)]
                 max-w-full"
      style={{
        aspectRatio: '794 / 1123',
        // The resume itself will be white, so a slight background on the container can help if needed.
        // backgroundColor: '#e0e0e0' // Example: Light gray for contrast if needed
      }}
      onContextMenu={handleContextMenu}
      aria-label="Example resume showcasing ResumeBoost output"
    >
      <div
        className="absolute top-0 left-0 origin-top-left w-[794px] h-[1123px] 
                   scale-[0.35] sm:scale-[0.45] md:scale-[0.4] lg:scale-[0.5]"
      >
        {/* Passing isPreview={false} to ensure no watermarks on landing page */}
        <ResumeDisplay resumeData={resumeData} isPreview={false} /> 
      </div>
    </div>
  );
}

