import { ProofData } from '@noir-lang/types';
import { toast } from 'react-toastify';
import { Noir } from '@noir-lang/noir_js';

const offChainVerification = async (noir?: Noir, proofData?: ProofData) => {
  if (!proofData || !noir) return;

  await toast.promise(noir.verifyProof(proofData), {
    pending: 'Verifying proof off-chain',
    success: 'Proof verified off-chain',
    error: 'Error verifying proof off-chain',
  });
};

export default offChainVerification;
