import React from 'react';
import { InferenceModel } from '@/models';

interface ModelGridElementProps {
  model: InferenceModel;
  onClick: () => void;
}

const ModelGridElement: React.FC<ModelGridElementProps> = ({
  model,
  onClick,
}) => (
  <div
    className="cursor-pointer rounded-lg border p-4 text-center shadow-md"
    onClick={onClick}
    onKeyDown={onClick}
    role="button"
    tabIndex={0}
  >
    <h3 className="mb-2 text-xl font-semibold">{model.name}</h3>
    <img
      src={model.thumbnail}
      alt={model.name}
      className="mb-2 h-auto w-full" // mb-2 h-40 w-full object-cover
    />
    <p className="text-gray-600">{model.description}</p>
  </div>
);

export default ModelGridElement;
