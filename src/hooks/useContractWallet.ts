"use client";

import { useEffect, useState } from "react";
import { V06 } from "userop";
import { type Address } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import type {
  Account,
  Chain,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";

export function useContractWallet(walletAddress: Address) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [contractAddress, setContractAddress] = useState<Address | null>(null);

  useEffect(() => {
    async function getWalletAddress() {
      if (!publicClient || !walletClient) {
        console.log("No public or wallet client");
        return;
      }

      const account = new V06.Account.Instance({
        ...V06.Account.Common.SimpleAccount.base(
          publicClient as PublicClient,
          walletClient as WalletClient<Transport, Chain | undefined, Account>
        ),
      });

      console.log("account", account);

      const senderAddress = await account.getSender();
      console.log("senderAddress", senderAddress);
      setContractAddress(senderAddress);
    }

    getWalletAddress();
  }, [publicClient, walletAddress]);

  return {
    contractWalletAddress: contractAddress,
    isLoading: !contractAddress,
    error: !contractAddress ? new Error("Could not get wallet address") : null,
  };
}
