import React from 'react';
import ModelGridElement from '@/components/ModelGridElement';
import { InferenceModel } from '@/models';

interface ModelGridProps {
  models: InferenceModel[];
  onModelClick: (model: InferenceModel) => void;
}

const ModelGrid: React.FC<ModelGridProps> = ({
  models,
  onModelClick,
}: ModelGridProps) => (
  <div className="grid grid-cols-2 gap-4">
    {models.map((model) => (
      <ModelGridElement
        key={model.id}
        model={model}
        onClick={() => onModelClick(model)}
      />
    ))}
  </div>
);

export default ModelGrid;
