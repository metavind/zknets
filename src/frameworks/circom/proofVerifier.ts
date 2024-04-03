import { plonk } from 'snarkjs';
import { CircomProofData } from '@/frameworks/circom';

const verifyProofCircom = async (
  modelName: string,
  proofData: CircomProofData
): Promise<boolean> => {
  const vkeyPath = `circuits/circom/${modelName}/verification_key.json`;

  const response = await fetch(vkeyPath);
  const vkey = (await response.json()) as unknown;
  const { publicSignals, proof } = proofData;

  const result = await plonk.verify(vkey, publicSignals, proof);
  return result;
};

export default verifyProofCircom;
