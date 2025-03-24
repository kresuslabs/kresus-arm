"use client";

import { useQuery } from "@tanstack/react-query";
import { V06 } from "userop";
import { getAddress, type Address } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import { ENTRYPOINT_ADDRESS, FACTORY_ADDRESS } from "@/config";
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
  const account = new V06.Account.Instance({
    ...V06.Account.Common.SimpleAccount.base(publicClient, walletClient),
    entryPointAddress: ENTRYPOINT_ADDRESS,
    factoryAddress: FACTORY_ADDRESS,
    salt: BigInt(getAddress(walletClient.account.address)),
  });

  return account.getSender();
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
