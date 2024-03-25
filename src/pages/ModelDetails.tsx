import React from 'react';
import { InferenceModel } from '@/models';

interface ModelDetailsProps {
  model: InferenceModel;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ model }) => (
  <div>
    <h2>{model.name}</h2>
    <p>{model.description}</p>
    <div>
      <h3>Input Shape:</h3>
      <p>{model.inputShape.join(' x ')}</p>
    </div>
    <div>
      <h3>Output Shape:</h3>
      <p>{model.outputShape.join(' x ')}</p>
    </div>
    {/* TODO: Add inference and proof generation components */}
  </div>
);

export default ModelDetails;
