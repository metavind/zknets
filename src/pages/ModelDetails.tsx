import React, { useState } from 'react';
import { ProofData } from '@noir-lang/types';
import { Noir } from '@noir-lang/noir_js';
import { InferenceModel } from '@/models';
import { Framework } from '@/frameworks';
import Circles from '@/components/Inputs/Circles';
import generateProofNoir from '@/frameworks/noir/proofGenerator';
import offChainVerification from '@/frameworks/noir/offChainVerifier';
import { mapProofToHex, mapHexToInt } from '@/utils/proof';

interface ModelDetailsProps {
  model: InferenceModel;
  selectedFramework: Framework;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({
  model,
  selectedFramework,
}) => {
  const [inferenceOutput, setInferenceOutput] = useState<number[] | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [proofData, setProofData] = useState<ProofData | undefined>(undefined);
  const [zkOutput, setZkOutput] = useState<number[] | null>(null);
  const [proofHex, setProofHex] = useState<string | null>(null);
  const [noirInstance, setNoirInstance] = useState<Noir | undefined>(undefined);

  const handleInputChange = (newInput: number[]) => {
    setInput(newInput);
  };

  const handleGenerateProof = async () => {
    const result = await model.runInference(input);
    setInferenceOutput(result);

    let noir: Noir | undefined;
    let generatedProofData: ProofData | undefined;

    switch (selectedFramework) {
      case Framework.Noir:
        ({ noir, proofData: generatedProofData } = await generateProofNoir(
          model.id,
          input.map((elem) => Math.round(elem * model.scalingFactor))
        ));
        setNoirInstance(noir);
        setProofData(generatedProofData);
        break;
      default:
        throw new Error('Unsupported framework');
    }

    if (generatedProofData) {
      const generatedZkOutput = generatedProofData.publicInputs;
      setZkOutput(mapHexToInt(generatedZkOutput));

      const hexProof = mapProofToHex(generatedProofData.proof);
      setProofHex(hexProof);
    }
  };

  const handleVerifyProofOffChain = async () => {
    switch (selectedFramework) {
      case Framework.Noir:
        await offChainVerification(noirInstance, proofData);
        break;
      default:
        throw new Error('Unsupported framework');
    }
  };

  const handleVerifyProofOnChain = async () => {
    // TODO: Implement on-chain verification
    /* {

    } */

    await Promise.resolve(-1);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="flex justify-center">
          <Circles width={500} height={500} onInputChange={handleInputChange} />
        </div>
        <p className="mt-2">Selected Input: {input.join(', ')}</p>
      </div>
      <div className="mb-6 flex justify-center space-x-4">
        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleGenerateProof}
        >
          Run Inference
          <br />& Generate Proof
        </button>

        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleVerifyProofOffChain}
        >
          Verify
          <br />
          (off-chain)
        </button>
        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleVerifyProofOnChain}
        >
          Verify
          <br />
          (on-chain)
        </button>
      </div>
      <div className="mb-6">
        {inferenceOutput && proofData && (
          <div>
            <h4>Inference Result:</h4>
            <p>{inferenceOutput.join(', ')}</p>
            <h4>Output:</h4>
            <p>{zkOutput?.join(', ')}</p>
            <h4>Generated Proof:</h4>
            <p>{proofHex}</p>
          </div>
        )}
      </div>
      <div className="mb-6">
        {proofData && (
          <div>
            <h4>Verified Proof:</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelDetails;
