import { CircuitSignals, PlonkProof, PublicSignals, plonk } from 'snarkjs';
import { mapToPrimeField } from '@/utils/proof';

const generateProofCircom = async (
  modelName: string,
  input: number[]
): Promise<{ proof: PlonkProof; publicSignals: PublicSignals }> => {
  const wasmPath = `/circuits/circom/${modelName}/circuit.wasm`;
  const ZkeyPath = `/circuits/circom/${modelName}/circuit_final.zkey`;

  const circuitInput: CircuitSignals = {
    a: mapToPrimeField(input),
  };

  const { proof, publicSignals } = await plonk.fullProve(
    circuitInput,
    wasmPath,
    ZkeyPath
  );

  return { proof, publicSignals };
};

export default generateProofCircom;
