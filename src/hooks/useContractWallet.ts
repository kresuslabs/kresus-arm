"use client";

import { erc4337Abi } from "@/abi/erc4337";
import { ENTRYPOINT_ADDRESS } from "@/config";
import { ENTRYPOINT_INIT_CODE_BASE } from "@/initCodeBase";
import { useEffect, useState } from "react";
import { type Address } from "viem";
import { usePublicClient } from "wagmi";

export function useContractWallet() {
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function getWalletAddress() {
      if (!publicClient) return;

      try {
        // Call getSenderAddress to get the counterfactual address
        await publicClient.simulateContract({
          address: ENTRYPOINT_ADDRESS,
          abi: erc4337Abi,
          functionName: "getSenderAddress",
          args: [ENTRYPOINT_INIT_CODE_BASE as `0x${string}`],
        });
      } catch (error: any) {
        // The call is expected to revert with the sender address
        if (error.cause?.data?.errorName === "SenderAddressResult") {
          const walletAddress = error.cause.data.args[0];
          setWalletAddress(walletAddress);
        } else {
          console.error("Error getting wallet address:", error);
          setWalletAddress(null);
        }
      }
    }

    getWalletAddress();
  }, [publicClient]);

  return {
    walletAddress,
  };
}
