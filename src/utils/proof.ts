import { PlonkProof as CircomPlonkProof } from 'snarkjs';

const prime = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

export const mapToPrimeField = (input: number[]): bigint[] =>
  input.map((val) => {
    let res = BigInt(val);
    if (res < 0) {
      let nres = -res;
      if (nres >= prime) nres %= prime;
      res = prime - nres;
    } else {
      res = res >= prime ? res % prime : res;
    }
    return res;
  });

export const mapFromPrimeField = (input: string[]): string[] =>
  input.map((val) => {
    let res = BigInt(val);
    if (res > prime / BigInt(2)) {
      res = prime - res;
      return `-${res.toString()}`;
    }
    return res.toString();
  });

export const mapIntToHex = (input: bigint[]): string[] =>
  input.map((val) => `0x${val.toString(16)}`);

export const splitHexInPairs = (hex: string): string =>
  hex.match(/.{2}/g)?.join(' ') || '';

export const getCircomProof = (proof: CircomPlonkProof): string[] => [
  proof.A[0],
  proof.A[1],
  proof.B[0],
  proof.B[1],
  proof.C[0],
  proof.C[1],
  proof.Z[0],
  proof.Z[1],
  proof.T1[0],
  proof.T1[1],
  proof.T2[0],
  proof.T2[1],
  proof.T3[0],
  proof.T3[1],
  proof.Wxi[0],
  proof.Wxi[1],
  proof.Wxiw[0],
  proof.Wxiw[1],
  proof.eval_a,
  proof.eval_b,
  proof.eval_c,
  proof.eval_s1,
  proof.eval_s2,
  proof.eval_zw,
];

export const mapCircomProofToHex = (proof: CircomPlonkProof): string => {
  const proofArray = getCircomProof(proof);

  const hexProofArray = proofArray.map((val) => {
    const hexElem = BigInt(val);
    return hexElem.toString(16).padStart(64, '0');
  });

  const hexProof = hexProofArray.join('');

  return splitHexInPairs(hexProof);
};

export const mapNoirProofToHex = (proof: Uint8Array): string =>
  Array.from(proof)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
