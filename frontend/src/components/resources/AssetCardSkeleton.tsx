import React from 'react';

export const AssetCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 overflow-hidden animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      
      <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      
      <div className="space-y-3">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex justify-between">
          <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
