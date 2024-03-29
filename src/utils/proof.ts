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

export const mapIntToHex = (input: bigint[]): string[] =>
  input.map((val) => `0x${val.toString(16)}`);

export const mapProofToHex = (proof: Uint8Array): string =>
  Array.from(proof)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
