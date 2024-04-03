import { mapToPrimeField } from '@/utils/proof';

export const gaussianRandom = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const prepareInputForInference = (
  input: number[],
  scalingFactor: number
): number[] => input.map((val) => Math.round(val * scalingFactor));

export const prepareInputForCircuit = (
  input: number[],
  scalingFactor: number
): bigint[] => mapToPrimeField(prepareInputForInference(input, scalingFactor));
