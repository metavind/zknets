import { Noir } from '@noir-lang/noir_js';
import { InputMap, ProofData } from '@noir-lang/types';
import generateProofNoir from '@/frameworks/noir/proofGenerator';
import { InferenceModel } from '@/models';
import { prepareInputForCircuit } from '@/utils/math';
import {
  mapFromPrimeField,
  mapIntToHex,
  mapNoirProofToHex,
} from '@/utils/proof';

export type NoirProofData = ProofData;

export const generateProofBundleNoir = async (
  model: InferenceModel,
  input: number[]
): Promise<{
  proofData: NoirProofData;
  zkOutput: string[];
  proofHex: string;
  noirInstance: Noir;
}> => {
  const circuitInput: InputMap = {
    input: mapIntToHex(prepareInputForCircuit(input, model.inputScalingFactor)),
  };
  const { noir, proofData } = await generateProofNoir(model.id, circuitInput);
  const zkOutput = mapFromPrimeField(proofData.publicInputs);
  const proofHex = mapNoirProofToHex(proofData.proof);
  return { proofData, zkOutput, proofHex, noirInstance: noir };
};
