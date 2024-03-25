import React, { useState } from 'react';
import { Framework } from '@/frameworks';
import FrameworkSelector from '@/components/FrameworkSelector';
import { CirclesModel, InferenceModel } from '@/models';
import ModelGrid from '@/components/ModelGrid';

const models = [new CirclesModel()];

const App: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(
    Framework.Noir
  );

  const handleModelClick = (model: InferenceModel) => {
    console.log('Clicked model:', model.name);
    // TODO: Implement model selection logic
  };

  const handleFrameworkChange = (framework: Framework) => {
    setSelectedFramework(framework);
  };

  const filteredModels = models.filter((model) =>
    model.supportedFrameworks.includes(selectedFramework)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">ZK Nets</h1>
      <FrameworkSelector
        selectedFramework={selectedFramework}
        onFrameworkChange={handleFrameworkChange}
      />
      <ModelGrid models={filteredModels} onModelClick={handleModelClick} />
    </div>
  );
};

export default App;
