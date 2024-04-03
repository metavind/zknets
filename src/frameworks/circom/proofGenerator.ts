import { CircuitSignals, PlonkProof, PublicSignals, plonk } from 'snarkjs';

const generateProofCircom = async (
  modelName: string,
  circuitInput: CircuitSignals
): Promise<{ proof: PlonkProof; publicSignals: PublicSignals }> => {
  const wasmPath = `/circuits/circom/${modelName}/circuit.wasm`;
  const ZkeyPath = `/circuits/circom/${modelName}/circuit_final.zkey`;

  const { proof, publicSignals } = await plonk.fullProve(
    circuitInput,
    wasmPath,
    ZkeyPath
  );

  return { proof, publicSignals };
};

export default generateProofCircom;
