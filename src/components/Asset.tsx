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
    <div className="px-4 py-3 hover:bg-black/50 transition-colors flex items-center border-b border-gray-800/50 last:border-b-0">
      {/* Token Icon */}
      <div className="w-8">
        {portfolioItem.token.logoURI ? (
          <img
            src={portfolioItem.token.logoURI}
            alt={portfolioItem.token.symbol}
            className="w-8 h-8 rounded-full object-cover bg-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">?</span>
          </div>
        )}
      </div>

      {/* Token Name & Chain */}
      <div className="flex-1 ml-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{portfolioItem.token.name}</span>
          <img
            src={`https://dd.dexscreener.com/ds-data/chains/${chainIdToChain(
              portfolioItem.token.chainId
            ).toLowerCase()}.png`}
            className="w-4 h-4"
            alt={chainIdToChain(portfolioItem.token.chainId)}
          />
        </div>
        <div className="text-sm text-gray-400">
          {portfolioItem.token.symbol}
        </div>
      </div>

      {/* Token Amount */}
      <div className="text-right mr-8 w-[150px]">
        <div className="font-medium">{formatAmount(uiAmount.toString())}</div>
        <div className="text-sm text-gray-400">
          {portfolioItem.token.symbol}
        </div>
      </div>

      {/* Token Price */}
      <div className="text-right mr-8 w-[100px]">
        <div className="font-medium">${price.toFixed(2)}</div>
      </div>

      {/* Token Value */}
      <div className="text-right min-w-[100px]">
        <div className="font-medium">${totalValue.toFixed(2)}</div>
      </div>
    </div>
  );
}
