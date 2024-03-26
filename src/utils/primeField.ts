const prime = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

export const mapToHex = (input: number[]): string[] =>
  input.map((val) => {
    let res = BigInt(val);
    if (res < 0) {
      let nres = -res;
      if (nres >= prime) nres %= prime;
      res = prime - nres;
    } else {
      res = res >= prime ? res % prime : res;
    }
    return `0x${res.toString(16)}`;
  });
