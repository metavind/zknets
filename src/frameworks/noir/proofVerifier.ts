import { ProofData } from '@noir-lang/types';
import { Noir } from '@noir-lang/noir_js';

const verifyProofNoir = async (
  noir: Noir | undefined,
  proofData: ProofData | undefined
): Promise<boolean> => {
  if (!noir || !proofData) {
    throw new Error('Noir instance or proof data is not provided');
  }
  const result = await noir.verifyProof(proofData);

  return result;
};

export default verifyProofNoir;
