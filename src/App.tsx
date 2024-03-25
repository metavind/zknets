import React, { useState } from 'react';
import { Framework } from '@/frameworks';
import FrameworkSelector from '@/components/FrameworkSelector';
import { CirclesModel, InferenceModel } from '@/models';
import ModelGrid from '@/components/ModelGrid';
import ModelDetails from '@/pages/ModelDetails';

const models = [new CirclesModel()];

const App: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(
    Framework.Noir
  );
  const [selectedModel, setSelectedModel] = useState<InferenceModel | null>(
    null
  );

  const handleModelClick = (model: InferenceModel) => {
    setSelectedModel(model);
  };

  const handleFrameworkChange = (framework: Framework) => {
    setSelectedFramework(framework);
    setSelectedModel(null);
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
      {selectedModel ? (
        <ModelDetails model={selectedModel} />
      ) : (
        <ModelGrid models={filteredModels} onModelClick={handleModelClick} />
      )}
    </div>
  );
};

export default App;
