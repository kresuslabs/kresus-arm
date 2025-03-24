"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useContractWallet } from "../hooks/useContractWallet";
import { usePortfolio } from "../hooks/usePortfolio";

export function AssetsSection() {
  const { address } = useAccount();
  const { contractWalletAddress } = useContractWallet(address as Address);
  const { data: portfolio } = usePortfolio(contractWalletAddress ?? undefined);

  return (
    <div className="p-4">
      {contractWalletAddress && (
        <div>
          <p>Address: {contractWalletAddress}</p>
        </div>
      )}
      {portfolio && (
        <div>
          <p>Portfolio: {portfolio.length}</p>
        </div>
      )}
    </div>
  );
}
