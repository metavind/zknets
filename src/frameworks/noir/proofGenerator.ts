import { toast } from 'react-toastify';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { InputMap, CompiledCircuit, ProofData } from '@noir-lang/types';

interface GenerateProofNoirResult {
  noir: Noir;
  proofData: ProofData;
}

const generateProofNoir = async (
  modelName: string,
  circuitInput: InputMap
): Promise<GenerateProofNoirResult> => {
  const circuitPath = `/circuits/noir/${modelName}.json`;
  const response = await fetch(circuitPath);
  const circuit = (await response.json()) as CompiledCircuit;

  const backend = new BarretenbergBackend(circuit, {
    threads: navigator.hardwareConcurrency,
  });
  const noir = new Noir(circuit, backend);

  await toast.promise(noir.init(), {
    pending: 'Initializing Noir...',
    success: 'Noir initialized!',
    error: 'Error initializing Noir',
  });

  const proofData = await toast.promise(noir.generateProof(circuitInput), {
    pending: 'Generating proof',
    success: 'Proof generated',
    error: 'Error generating proof',
  });

  return { noir, proofData };
};

export default generateProofNoir;
