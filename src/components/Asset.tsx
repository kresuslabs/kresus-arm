import { SUPPORTED_NETWORKS } from "@/config";
import { PortfolioItem } from "@/types/portfolio";

function chainIdToChain(chainId: number): string {
  return (
    SUPPORTED_NETWORKS.find((network) => network.chainId === chainId)?.chain ??
    "unknown"
  );
}

export function Asset({ portfolioItem }: { portfolioItem: PortfolioItem }) {
  // Helper function to format amounts
  const formatAmount = (amount: string): string => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 1_000_000_000) {
      return (numAmount / 1_000_000_000).toFixed(3) + "B";
    } else if (numAmount >= 1_000_000) {
      return (numAmount / 1_000_000).toFixed(3) + "M";
    } else if (numAmount >= 1000) {
      return numAmount.toFixed(3);
    } else {
      return numAmount.toFixed(6);
    }
  };

  const price = portfolioItem.token.priceUSD
    ? parseFloat(portfolioItem.token.priceUSD)
    : 0;
  console.log(portfolioItem.token.name, portfolioItem.balance);
  const uiAmount =
    parseFloat(portfolioItem.balance) / 10 ** portfolioItem.token.decimals;
  const totalValue = price * uiAmount;

  return (
    <div className="p-3 sm:p-4 hover:bg-black/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          {portfolioItem.token.logoURI ? (
            <img
              src={portfolioItem.token.logoURI}
              alt={portfolioItem.token.symbol}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">?</span>
            </div>
          )}
          <div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <div className="hover:text-blue-500 truncate max-w-[90px] sm:max-w-none cursor-pointer">
                  {portfolioItem.token.name}
                </div>
                <img
                  src={
                    "https://dd.dexscreener.com/ds-data/chains/" +
                    chainIdToChain(portfolioItem.token.chainId).toLowerCase() +
                    ".png"
                  }
                  className="w-4 h-4"
                  alt={chainIdToChain(portfolioItem.token.chainId)}
                />
              </h3>
              <p className="text-sm text-gray-400">
                {formatAmount(uiAmount.toString())} {portfolioItem.token.symbol}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div>
              <p className="font-bold">${totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-400">${price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
