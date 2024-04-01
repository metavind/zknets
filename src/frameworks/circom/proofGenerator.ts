import { CircuitSignals, PlonkProof, PublicSignals, plonk } from 'snarkjs';

export async function generateCircomProof(
  input: CircuitSignals
): Promise<{ proof: PlonkProof; publicSignals: PublicSignals }> {
  const { proof, publicSignals } = await plonk.fullProve(
    input,
    '/circuits/circom/circles/circuit.wasm',
    'circuits/circom/circles/circuit_final.zkey'
  );

  return { proof, publicSignals };
}
