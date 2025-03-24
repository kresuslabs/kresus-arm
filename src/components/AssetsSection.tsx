"use client";

import { useEffect, useState } from "react";
import { useContractWallet } from "../hooks/useContractWallet";

export function AssetsSection() {
  const { walletAddress } = useContractWallet();
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
      {walletAddress && (
        <div>
          <p>Address: {walletAddress}</p>
        </div>
      )}
    </div>
  );
}
