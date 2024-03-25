import React from 'react';
import { Framework } from '@/frameworks';

interface FrameworkSelectorProps {
  selectedFramework: string;
  onFrameworkChange: (framework: Framework) => void;
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  selectedFramework,
  onFrameworkChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFrameworkChange(event.target.value as Framework);
  };
  return (
    <div className="mb-4">
      <label
        htmlFor="framework-selector"
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        Select a framework:
        <select
          id="framework-selector" // This ID can actually be removed if not used elsewhere for CSS or JavaScript
          value={selectedFramework}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          {Object.values(Framework).map((framework) => (
            <option key={framework} value={framework}>
              {framework}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FrameworkSelector;
