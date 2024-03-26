import { toast } from 'react-toastify';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { ProofData } from '@noir-lang/types';
import { mapToHex } from '@/utils/primeField';
import { getCircuit } from '@/frameworks/noir/circuitCompiler';

interface GenerateProofNoirResult {
  noir: Noir;
  proofData: ProofData;
}

const generateProofNoir = async (
  model: string,
  input: number[]
): Promise<GenerateProofNoirResult> => {
  const inputs = { input: mapToHex(input) };

  const circuit = await getCircuit(model);

  const backend = new BarretenbergBackend(circuit, {
    threads: navigator.hardwareConcurrency,
  });
  const noir = new Noir(circuit, backend);

  await toast.promise(noir.init(), {
    pending: 'Initializing Noir...',
    success: 'Noir initialized!',
    error: 'Error initializing Noir',
  });

  const proofData = await toast.promise(noir.generateProof(inputs), {
    pending: 'Generating proof',
    success: 'Proof generated',
    error: 'Error generating proof',
  });

  return { noir, proofData };
};

export default generateProofNoir;
