import { SUPPORTED_NETWORKS } from "@/config";
import { PortfolioItem } from "@/types/portfolio";

function chainIdToChain(chainId: number): string {
  return (
    SUPPORTED_NETWORKS.find((network) => network.chainId === chainId)?.chain ??
    "unknown"
  );
}

export function Asset({
  portfolioItem,
  isCow,
}: {
  portfolioItem: PortfolioItem;
  isCow: boolean;
}) {
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
    <div className="px-4 py-3 hover:bg-black/50 transition-colors flex items-center border-b border-gray-800/50 last:border-b-0 group">
      {/* Token Icon + Name & Chain */}
      <div className="flex items-center">
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

        <div className="ml-3">
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

        {/* Action Button */}
        {isCow && (
          <button
            className="opacity-0 group-hover:opacity-100 ml-4 p-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-all"
            title="COW wallet action"
          >
            Action
          </button>
        )}
      </div>

      {/* Token Amount */}
      <div className="ml-auto text-right mr-8 w-[150px]">
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
