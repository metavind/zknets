import { ethers, Addressable, Contract } from 'ethers';
import { Framework } from '@/frameworks';

// const chainId = '0xaa36a7';
const chainId = '0x7a69'; // 31337

declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider;
  }
}

export const initializeEthers = async (
  selectedFramework: Framework,
  modelName: string
): Promise<Contract | null> => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const currentNetworkId = (await window.ethereum.request({
      method: 'net_version',
    })) as string;

    if (currentNetworkId !== chainId) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const framework = selectedFramework.toLowerCase();

    const addressesResponse = await fetch('/circuits/contract_addresses.json');
    const addresses = await addressesResponse.json();
    const contractAddress = addresses[framework][modelName] as Addressable;

    const artifactsResponse = await fetch(
      `/circuits/${framework}/${modelName}/artifacts.json`
    );
    const contractArtifacts = await artifactsResponse.json();

    const contract = new ethers.Contract(
      contractAddress,
      contractArtifacts.abi,
      signer
    );

    return contract;
  }
  return null;
};
