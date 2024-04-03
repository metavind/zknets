import { PlonkProof, PublicSignals } from 'snarkjs';
import { InferenceModel } from '@/models';
import generateProofCircom from '@/frameworks/circom/proofGenerator';
import { prepareInputForCircuit } from '@/utils/math';
import { mapFromPrimeField, mapCircomProofToHex } from '@/utils/proof';

export interface CircomProofData {
  proof: PlonkProof;
  publicSignals: PublicSignals;
}

export const generateProofBundleCircom = async (
  model: InferenceModel,
  input: number[]
): Promise<{
  proofData: CircomProofData;
  zkOutput: string[];
  proofHex: string;
}> => {
  const circuitInput = prepareInputForCircuit(input, model.inputScalingFactor);
  const { proof, publicSignals } = await generateProofCircom(
    model.id,
    circuitInput
  );
  const zkOutput = mapFromPrimeField(publicSignals.slice(0, -input.length));
  const proofHex = mapCircomProofToHex(proof);
  return { proofData: { proof, publicSignals }, zkOutput, proofHex };
};
