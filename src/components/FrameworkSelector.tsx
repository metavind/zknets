import React from 'react';
import { Framework } from '@/frameworks';

interface FrameworkSelectorProps {
  selectedFramework: string;
  onFrameworkChange: (framework: Framework) => void;
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  selectedFramework,
  onFrameworkChange,
}) => (
  <div className="mb-4 flex justify-center space-x-4">
    {Object.values(Framework).map((framework) => (
      <button
        type="button"
        key={framework}
        className={`rounded-lg px-6 py-3 font-semibold ${
          selectedFramework === framework.toString()
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
        }`}
        onClick={() => onFrameworkChange(framework)}
      >
        {framework}
      </button>
    ))}
  </div>
);

export default FrameworkSelector;
