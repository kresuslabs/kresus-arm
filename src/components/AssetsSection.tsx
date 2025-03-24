"use client";

import { Asset } from "@/components/Asset";
import { useContractWallet } from "@/hooks/useContractWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { PortfolioItem } from "@/types/portfolio";
import { useEffect, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { Address } from "viem";
import { useAccount } from "wagmi";

export function AssetsSection() {
  const { address } = useAccount();
  const { data: contractWalletAddress } = useContractWallet(address as Address);
  const { data: cowPortfolio } = usePortfolio(
    contractWalletAddress ?? undefined
  );
  const { data: eowPortfolio } = usePortfolio(address ?? undefined);

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 1000);
    }
  }, [isCopied]);

  const TableHeader = () => (
    <div className="px-4 py-2 text-sm font-semibold border-b border-gray-800 flex items-center">
      <div className="flex-1">Token</div>
      <div className="text-right mr-8 w-[150px]">Balance</div>
      <div className="text-right mr-8 w-[100px]">Price</div>
      <div className="text-right min-w-[100px]">Value</div>
    </div>
  );

  const PortfolioSection = ({
    title,
    portfolio,
    isCow,
  }: {
    title: string;
    portfolio: PortfolioItem[];
    isCow: boolean;
  }) => (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-medium">{title} </h2>
        {isCow && (
          <div
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-1"
            onClick={() => {
              navigator.clipboard.writeText(contractWalletAddress ?? "");
              setIsCopied(true);
            }}
          >
            ({contractWalletAddress?.slice(0, 6)}...
            {contractWalletAddress?.slice(-4)})
            {isCopied ? (
              <FaCheck className="ml-1" />
            ) : (
              <FaCopy className="ml-1" />
            )}
          </div>
        )}
      </div>
      <div className="rounded-xl bg-black/60 overflow-hidden">
        <TableHeader />
        <div>
          {portfolio?.map((item) => (
            <Asset
              key={item.token.address}
              portfolioItem={item}
              isCow={isCow}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {cowPortfolio && cowPortfolio.length > 0 && (
        <PortfolioSection
          title="Smart Wallet Assets"
          portfolio={cowPortfolio}
          isCow={true}
        />
      )}

      {eowPortfolio && eowPortfolio.length > 0 && (
        <PortfolioSection
          title="EOA Wallet Assets"
          portfolio={eowPortfolio}
          isCow={false}
        />
      )}
    </div>
  );
}
