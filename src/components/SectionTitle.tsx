
import React from 'react';

interface SectionTitleProps {
  title: string;
  description?: string;
  className?: string;
  color?: 'default' | 'light';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  description,
  className = "",
  color = 'default'
}) => {
  const textColor = color === 'light' ? 'text-white' : 'text-gray-800';
  const descriptionColor = color === 'light' ? 'text-gray-200' : 'text-gray-600';

  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="relative inline-block">
        <h2 className={`text-3xl font-bold mb-3 ${textColor} relative z-10`}>
          {title}
        </h2>
        <div className="absolute bottom-1 left-0 right-0 h-3 bg-primary/30 -skew-x-6 transform -rotate-2 z-0"></div>
      </div>
      {description && (
        <p className={`${descriptionColor} max-w-2xl mx-auto mt-4`}>
          {description}
        </p>
      )}
      <div className="flex items-center justify-center mt-6">
        <div className="h-0.5 w-8 bg-gray-300"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary mx-2"></div>
        <div className="h-0.5 w-20 bg-primary"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary mx-2"></div>
        <div className="h-0.5 w-8 bg-gray-300"></div>
      </div>
    </div>
  );
};

export default SectionTitle;
