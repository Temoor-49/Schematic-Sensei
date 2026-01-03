
import React from 'react';

interface BlueprintViewerProps {
  image: string;
}

const BlueprintViewer: React.FC<BlueprintViewerProps> = ({ image }) => {
  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl blueprint-grid group">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <img 
          src={image} 
          alt="Schematic" 
          className="max-w-full max-h-full object-contain rounded-md shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-600 text-xs font-medium text-blue-400">
        LIVE SCHEMATIC VIEW
      </div>
    </div>
  );
};

export default BlueprintViewer;
