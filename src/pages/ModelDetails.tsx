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
  const [proofGenerated, setProofGenerated] = useState<boolean>(false);
  const [proofData, setProofData] = useState<ProofData | undefined>(undefined);
  const [zkOutput, setZkOutput] = useState<number[] | null>(null);
  const [proofHex, setProofHex] = useState<string | null>(null);
  const [noirInstance, setNoirInstance] = useState<Noir | undefined>(undefined);

  const handleInputChange = (newInput: number[]) => {
    setInferenceOutput(null);
    setZkOutput(null);
    setProofGenerated(false);
    setProofData(undefined);
    setProofHex(null);
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
      setProofGenerated(true);
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
      <div className="mb-8 flex justify-center space-x-4">
        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleGenerateProof}
          disabled={input.length === 0}
        >
          Run Inference
          <br />& Generate Proof
        </button>

        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleVerifyProofOffChain}
          disabled={!proofGenerated}
        >
          Verify
          <br />
          (off-chain)
        </button>
        <button
          className="mb-2 me-2 w-60 rounded-lg border border-gray-800 bg-gray-100 px-10 py-5 text-center text-lg font-semibold text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          type="button"
          onClick={handleVerifyProofOnChain}
          disabled={!proofGenerated}
        >
          Verify
          <br />
          (on-chain)
        </button>
      </div>
      <div className="mb-6 flex justify-center">
        <div className="w-3/4 border-t-2 border-gray-400 pt-6">
          <div className="px-40">
            <div className="mb-6 mt-2 flex justify-center space-x-32">
              <div>
                <h4 className="mb-2 text-xl font-semibold">Expected Output</h4>
                <p className="text-center">
                  {inferenceOutput ? inferenceOutput.join(', ') : '-'}
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-xl font-semibold">Model Output</h4>
                <p className="text-center">
                  {zkOutput ? zkOutput.join(', ') : '-'}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            {inferenceOutput && proofData && (
              <div>
                <h4 className="mb-2 text-xl font-semibold">Proof</h4>
                <div className="h-40 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap font-mono text-sm">
                    {proofHex}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
