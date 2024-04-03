import React, { useState } from 'react';
import { Noir } from '@noir-lang/noir_js';
import { InferenceModel } from '@/models';
import { Framework } from '@/frameworks';
import Circles from '@/components/Inputs/Circles';
import runInference from '@/models/inference';
import {
  CircomProofData,
  generateProofBundleCircom,
} from '@/frameworks/circom';
import { NoirProofData, generateProofBundleNoir } from '@/frameworks/noir';
import verifyProofNoir from '@/frameworks/noir/proofVerifier';
import verifyProofCircom from '@/frameworks/circom/proofVerifier';

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
  const [proofData, setProofData] = useState<
    CircomProofData | NoirProofData | undefined
  >(undefined);
  const [zkOutput, setZkOutput] = useState<string[] | null>(null);
  const [proofHex, setProofHex] = useState<string | null>(null);
  const [noirInstance, setNoirInstance] = useState<Noir | undefined>(undefined);
  const [generateProofStatus, setGenerateProofStatus] = useState<
    'idle' | 'success' | 'failure'
  >('idle');
  const [verifyProofStatus, setVerifyProofStatus] = useState<
    'idle' | 'success' | 'failure'
  >('idle');
  const [verifyProofOnChainStatus, setVerifyProofOnChainStatus] = useState<
    'idle' | 'success' | 'failure'
  >('idle');

  const handleInputChange = (newInput: number[]) => {
    setInferenceOutput(null);
    setZkOutput(null);
    setProofData(undefined);
    setProofHex(null);
    setNoirInstance(undefined);
    setGenerateProofStatus('idle');
    setVerifyProofStatus('idle');
    setVerifyProofOnChainStatus('idle');
    setInput(newInput);
  };

  const handleGenerateProof = async () => {
    const result = await runInference(model, input);
    setInferenceOutput(result);

    let generatedProofData: CircomProofData | NoirProofData | undefined;
    let generatedZkOutput: string[];
    let generatedProofHex: string;

    switch (selectedFramework) {
      case Framework.Circom: {
        const {
          proofData: circomProofData,
          zkOutput: circomZkOutput,
          proofHex: circomProofHex,
        } = await generateProofBundleCircom(model, input);

        generatedProofData = circomProofData;
        generatedZkOutput = circomZkOutput;
        generatedProofHex = circomProofHex;
        break;
      }
      case Framework.Noir: {
        const {
          proofData: noirProofData,
          zkOutput: noirZkOutput,
          proofHex: noirProofHex,
          noirInstance: noir,
        } = await generateProofBundleNoir(model, input);

        const generatedNoirInstance = noir;
        setNoirInstance(generatedNoirInstance);

        generatedProofData = noirProofData;
        generatedZkOutput = noirZkOutput;
        generatedProofHex = noirProofHex;
        break;
      }
      default:
        throw new Error('Unsupported framework');
    }

    if (generatedProofData) {
      setProofData(generatedProofData);
      setZkOutput(generatedZkOutput);
      setProofHex(generatedProofHex);
      setGenerateProofStatus('success');
    }
  };

  const handleVerifyProof = async () => {
    let verifyStatus: boolean = false;
    switch (selectedFramework) {
      case Framework.Circom: {
        verifyStatus = await verifyProofCircom(
          model.id,
          proofData as CircomProofData
        );
        break;
      }
      case Framework.Noir: {
        if (!noirInstance) {
          throw new Error('Noir instance is required for Noir framework');
        }
        verifyStatus = await verifyProofNoir(
          noirInstance,
          proofData as NoirProofData
        );
        break;
      }
      default:
        throw new Error('Unsupported framework');
    }
    if (verifyStatus) {
      setVerifyProofStatus('success');
    } else {
      setVerifyProofStatus('failure');
    }
  };

  const handleVerifyProofOnChain = async () => {
    // TODO: Implement on-chain verification
    /* {

    } */
    setVerifyProofOnChainStatus('success');
    await Promise.resolve(-1);
  };

  return (
    <div className="text-center">
      <div className="mb-6 mt-8">
        <div className="flex justify-center">
          <Circles width={500} height={500} onInputChange={handleInputChange} />
        </div>
      </div>
      <div className="mb-8 flex justify-center space-x-4">
        <button
          className={`mb-2 me-2 w-60 rounded-lg border px-10 py-5 text-center text-lg font-semibold text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${
            generateProofStatus === 'success'
              ? 'border-green-600 bg-green-300'
              : 'border-gray-800 bg-gray-100  hover:bg-gray-900 hover:text-white dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800'
          }`}
          type="button"
          onClick={handleGenerateProof}
          disabled={input.length === 0 || generateProofStatus === 'success'}
        >
          Generate Proof
        </button>

        <button
          className={`mb-2 me-2 w-60 rounded-lg border px-10 py-5 text-center text-lg font-semibold text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${
            verifyProofStatus === 'success'
              ? 'border-green-600 bg-green-300'
              : 'border-gray-800 bg-gray-100  hover:bg-gray-900 hover:text-white dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800'
          }`}
          type="button"
          onClick={handleVerifyProof}
          disabled={
            generateProofStatus !== 'success' || verifyProofStatus === 'success'
          }
        >
          Verify Proof
        </button>
        <button
          className={`mb-2 me-2 w-60 rounded-lg border px-10 py-5 text-center text-lg font-semibold text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${
            verifyProofOnChainStatus === 'success'
              ? 'border-green-600 bg-green-300'
              : 'border-gray-800 bg-gray-100  hover:bg-gray-900 hover:text-white dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800'
          }`}
          type="button"
          onClick={handleVerifyProofOnChain}
          disabled={
            generateProofStatus !== 'success' ||
            verifyProofOnChainStatus === 'success'
          }
        >
          Verify Proof
          <br />
          (on-chain)
        </button>
      </div>
      <div className="mb-6 flex justify-center">
        {inferenceOutput && (
          <div className="w-full border-t-2 border-gray-400 pt-6">
            <div className="px-40">
              <div className="mb-6 mt-2 flex justify-center space-x-32">
                <div>
                  <h4 className="mb-2 text-xl font-semibold">
                    Inference Output
                  </h4>
                  <p className="text-center text-lg">
                    {inferenceOutput ? inferenceOutput.join(', ') : '-'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-semibold">Circuit Output</h4>
                  <p className="text-center text-lg">
                    {zkOutput ? zkOutput.join(', ') : '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              {proofData && (
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
        )}
      </div>
    </div>
  );
};

export default ModelDetails;
