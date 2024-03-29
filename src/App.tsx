import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Framework } from '@/frameworks';
import FrameworkSelector from '@/components/FrameworkSelector';
import InitWasmNoir from '@/components/InitWasmNoir';
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

  const WasmInitializationWrapper = InitWasmNoir;

  return (
    <WasmInitializationWrapper>
      <div>
        <h1 className="mb-6 mt-6 text-center text-4xl font-bold">ZK Nets</h1>
        <FrameworkSelector
          selectedFramework={selectedFramework}
          onFrameworkChange={handleFrameworkChange}
        />
        <div className="mb-6 flex justify-center">
          <div className="w-3/4 border-t-2 border-gray-400">
            {selectedModel ? (
              <ModelDetails
                model={selectedModel}
                selectedFramework={selectedFramework}
              />
            ) : (
              <div className="p-6 text-center">
                <ModelGrid
                  models={filteredModels}
                  onModelClick={handleModelClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </WasmInitializationWrapper>
  );
};

export default App;
