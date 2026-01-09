import React from 'react';
import type { FuzzyRule } from '../types';

interface FuzzyRuleDisplayProps {
  rules: FuzzyRule[];
}

export const FuzzyRuleDisplay: React.FC<FuzzyRuleDisplayProps> = ({ rules }) => {
  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.id} className="bg-gray-100 p-3 rounded-md border border-gray-200">
          <div className="font-mono text-sm">
            <span className="font-bold text-blue-700">IF</span> (
            {rule.if.map((condition, index) => (
              <React.Fragment key={index}>
                <span className="text-indigo-600">{condition}</span>
                {index < rule.if.length - 1 && <span className="font-bold text-gray-500"> AND </span>}
              </React.Fragment>
            ))}
            )
          </div>
          <div className="font-mono text-sm mt-1">
            <span className="font-bold text-green-700">THEN</span> <span className="text-purple-600">{rule.then}</span>
          </div>
          <p className="text-xs text-gray-600 mt-2 pl-2 border-l-2 border-gray-300">
            <strong>Rationale:</strong> {rule.explanation}
          </p>
        </div>
      ))}
    </div>
  );
};
