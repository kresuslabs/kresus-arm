"use client";

import { useQuery } from "@tanstack/react-query";
import { getAddress, type Address } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import { FACTORY_ADDRESS } from "@/config";
import type {
  Account,
  Chain,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";

async function getContractWalletAddress(
  publicClient: PublicClient,
  walletClient: WalletClient<Transport, Chain | undefined, Account>
) {
  const salt = BigInt(getAddress(walletClient.account.address).toLowerCase());
  const cowAddress = (await publicClient.readContract({
    address: FACTORY_ADDRESS,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "salt", type: "uint256" },
        ],
        name: "getAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getAddress",
    args: [walletClient.account.address, salt],
  })) as `0x${string}`;
  return cowAddress;
}

export function useContractWallet(walletAddress: Address) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["contractWallet", walletAddress],
    queryFn: async () => {
      if (!publicClient || !walletClient) {
        throw new Error("No public or wallet client");
      }
      return getContractWalletAddress(publicClient, walletClient);
    },
    enabled: !!publicClient && !!walletClient,
  });
}
