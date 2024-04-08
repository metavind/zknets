import { Contract } from 'ethers';
import { NoirProofData } from '@/frameworks/noir';

const verifyProofOnChainNoir = async (
  contract: Contract,
  proofData: NoirProofData
): Promise<boolean> => {
  const { proof, publicInputs } = proofData;

  const result = (await contract.verify(proof, publicInputs)) as boolean;

  return result;
};

export default verifyProofOnChainNoir;
