"use client";

import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useContractWallet } from "../hooks/useContractWallet";

export function AssetsSection() {
  const { address } = useAccount();
  const { contractWalletAddress } = useContractWallet(address as Address);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Wallet Info</h2>
      {contractWalletAddress && (
        <div>
          <p>Address: {contractWalletAddress}</p>
        </div>
      )}
    </div>
  );
}
