import React, { useState } from 'react';
import { ProofData } from '@noir-lang/types';
import { Noir } from '@noir-lang/noir_js';
import { InferenceModel } from '@/models';
import { Framework } from '@/frameworks';
import generateProofNoir from '@/frameworks/noir/proofGenerator';
import offChainVerification from '@/frameworks/noir/offChainVerifier';

interface ModelDetailsProps {
  model: InferenceModel;
  selectedFramework: Framework;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({
  model,
  selectedFramework,
}) => {
  const [inferenceResult, setInferenceResult] = useState<number[] | null>(null);
  const [proofData, setProofData] = useState<ProofData | undefined>(undefined);
  const [proofHex, setProofHex] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<number[] | null>(null);
  const [noirInstance, setNoirInstance] = useState<Noir | undefined>(undefined);

  const handleRunInference = async () => {
    // const input = [
    //  /* TODO: Get input from user */
    // ];
    // const result = await model.run(input);
    /* TODO: Get inference from tensorflowjs */
    const result = await Promise.resolve([3]);
    setInferenceResult(result);
  };

  const handleGenerateProof = async () => {
    // const input = [
    //   /* TODO: Get input from user */
    // ];

    const input = [192460, -394641];

    let noir: Noir | undefined;
    let generatedProofData: ProofData | undefined;

    switch (selectedFramework) {
      case Framework.Noir:
        ({ noir, proofData: generatedProofData } = await generateProofNoir(
          model.id,
          input
        ));
        setNoirInstance(noir);
        setProofData(generatedProofData);
        break;
      default:
        throw new Error('Unsupported framework');
    }

    if (generatedProofData) {
      const generatedOutputs = generatedProofData.publicInputs;
      setOutputs(generatedOutputs.map((elem) => parseInt(elem, 10)));

      const hexProof = Array.from(generatedProofData.proof)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');
      setProofHex(hexProof);
    }
  };

  const handleVerifyProof = async () => {
    switch (selectedFramework) {
      case Framework.Noir:
        await offChainVerification(noirInstance, proofData);
        break;
      default:
        throw new Error('Unsupported framework');
    }
  };

  return (
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
      <div>
        <h3>Inference</h3>
        <button type="button" onClick={handleRunInference}>
          Run Inference
        </button>
        {inferenceResult && (
          <div>
            <h4>Inference Result:</h4>
            <p>{inferenceResult.join(', ')}</p>
          </div>
        )}
      </div>
      <div>
        <h3>Proof Generation</h3>
        <button type="button" onClick={handleGenerateProof}>
          Generate Proof
        </button>
        {proofData && (
          <div>
            <h4>Generated Proof:</h4>
            <p>{proofHex}</p>
            <h4>Output:</h4>
            <p>{outputs?.join(', ')}</p>
          </div>
        )}
      </div>
      <div>
        <h3>Proof Verification (off-chain)</h3>
        <button type="button" onClick={handleVerifyProof}>
          Verify Proof (off-chain)
        </button>
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
