import { PlonkProof, PublicSignals } from 'snarkjs';

export interface CircomProofData {
  proof: PlonkProof;
  publicSignals: PublicSignals;
}
