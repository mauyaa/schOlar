import { ethers } from "ethers";
import ScholarshipFactoryABI from "./abis/ScholarshipFactory.json";
import ScholarshipVaultABI from "./abis/ScholarshipVault.json";

export const FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_FACTORY_ADDRESS ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.providers.Web3Provider((window as any).ethereum);
  }
  // fallback for SSR / no wallet
  return ethers.getDefaultProvider();
}

export function getSigner() {
  const provider = getProvider();
  if (provider instanceof ethers.providers.Web3Provider) {
    return provider.getSigner();
  }
  throw new Error("No injected wallet");
}

export function getFactoryContract(signerOrProvider?: any) {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(
    FACTORY_ADDRESS,
    (ScholarshipFactoryABI as any).abi,
    provider
  );
}

export function getVaultContract(address: string, signerOrProvider?: any) {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(address, (ScholarshipVaultABI as any).abi, provider);
}
