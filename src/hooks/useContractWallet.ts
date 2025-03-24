"use client";

import { erc4337Abi } from "@/abi/erc4337";
import { ENTRYPOINT_ADDRESS } from "@/config";
import { useEffect, useState } from "react";
import { encodeFunctionData, type Address } from "viem";
import { usePublicClient } from "wagmi";

function makeInitCode(walletAddress: Address) {
  return encodeFunctionData({
    abi: erc4337Abi,
    functionName: "getSenderAddress",
    args: [walletAddress],
  });
}

export function useContractWallet(walletAddress: Address) {
  const [contractAddress, setContractAddress] = useState<Address | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function getWalletAddress() {
      if (!publicClient || !ENTRYPOINT_ADDRESS) return;

      try {
        await publicClient.simulateContract({
          address: ENTRYPOINT_ADDRESS,
          abi: erc4337Abi,
          functionName: "getSenderAddress",
          args: [makeInitCode(walletAddress)],
        });
      } catch (error: any) {
        // The call is expected to revert with SenderAddressResult
        if (error.cause?.data?.errorName === "SenderAddressResult") {
          // The wallet address is in the first argument of the error
          const address = error.cause.data.args[0] as Address;
          setContractAddress(address);
        } else {
          console.error("Error getting wallet address:", error);
          setContractAddress(null);
        }
      }
    }

    getWalletAddress();
  }, [publicClient, walletAddress]);

  return {
    contractWalletAddress: contractAddress,
    isLoading: !contractAddress,
    error: !contractAddress ? new Error("Could not get wallet address") : null,
  };
}
