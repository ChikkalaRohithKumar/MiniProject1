import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
        <span className="text-blue-600 mr-2">{icon}</span>
        {title}
      </h4>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
};
