"use client";

import { Asset } from "@/components/Asset";
import { useContractWallet } from "@/hooks/useContractWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Address } from "viem";
import { useAccount } from "wagmi";

export function AssetsSection() {
  const { address } = useAccount();
  const { data: contractWalletAddress } = useContractWallet(address as Address);
  const { data: cowPortfolio } = usePortfolio(
    contractWalletAddress ?? undefined
  );
  const { data: eowPortfolio } = usePortfolio(address ?? undefined);

  return (
    <div className="p-4">
      {contractWalletAddress && (
        <div>
          <p>Address: {contractWalletAddress}</p>
        </div>
      )}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <p>COW Portfolio</p>
      </div>
      {cowPortfolio && (
        <div>
          {cowPortfolio.map((item) => (
            <Asset key={item.token.address} portfolioItem={item} />
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <p>EOW Portfolio</p>
      </div>
      {eowPortfolio && (
        <div>
          {eowPortfolio.map((item) => (
            <Asset key={item.token.address} portfolioItem={item} />
          ))}
        </div>
      )}
    </div>
  );
}
