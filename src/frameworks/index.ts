import { InterfaceAbi, Addressable } from 'ethers';

export enum Framework {
  Circom = 'Circom',
  Noir = 'Noir',
  // Add more frameworks here
}

export interface Artifacts {
  abi: InterfaceAbi;
  address: Addressable;
}
