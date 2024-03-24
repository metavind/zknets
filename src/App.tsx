import React from 'react';
import ModelGrid from '@/components/ModelGrid';
import { CirclesModel, InferenceModel } from '@/models/index';

const models = [new CirclesModel()];

const App: React.FC = () => {
  const handleModelClick = (model: InferenceModel) => {
    console.log('Clicked model:', model.name);
    // TODO: Implement model selection logic
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">ZK Nets</h1>
      {/* Placeholder for framework dropdown */}
      <ModelGrid models={models} onModelClick={handleModelClick} />
    </div>
  );
};

export default App;
