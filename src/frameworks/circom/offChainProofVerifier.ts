import { Contract } from 'ethers';
import { CircomProofData } from '@/frameworks/circom';
import { getCircomProof } from '@/utils/proof';

const verifyProofOnChainCircom = async (
  contract: Contract,
  proofData: CircomProofData
): Promise<boolean> => {
  const { publicSignals, proof } = proofData;
  const contractInputProof = getCircomProof(proof);

  const result = (await contract.verifyProof(
    contractInputProof,
    publicSignals
  )) as boolean;

  return result;
};

export default verifyProofOnChainCircom;
