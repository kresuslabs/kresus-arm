import { alchemyClients } from "@/config";
import { LifiToken, LifiTokenSchema } from "@/types/lifi";
import { PortfolioItem } from "@/types/portfolio";
import { useQuery } from "@tanstack/react-query";
import { getAddress } from "viem";

export async function getAnyToken(
  token: string,
  chainId: string
): Promise<LifiToken | null> {
  console.info("getAnyToken", token, chainId);
  try {
    const res = await fetch(
      `https://li.quest/v1/token?token=${token}&chain=${chainId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      console.error(res);
      return null;
    }
    const data = await res.json();
    return LifiTokenSchema.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function parseBalance(balance: string): bigint {
  return BigInt(balance);
}

export async function getTokensMetadata(
  addresses: string[],
  chainId: string
): Promise<Map<string, LifiToken>> {
  try {
    const metadataMap = new Map<string, LifiToken>();
    const addressesToFetch = addresses;

    if (addressesToFetch.length === 0) {
      return metadataMap;
    }

    const tokenPromises = addressesToFetch.map((address) => {
      return getAnyToken(getAddress(address), chainId);
    });

    const tokenResults = await Promise.all(tokenPromises);

    addressesToFetch.forEach((address, index) => {
      const metadata = tokenResults[index];
      if (!metadata) {
        console.error(`No metadata found for ${address}`);
        return;
      }

      if (!metadata.decimals) {
        console.error(`No decimals found for ${address}`);
        return;
      }

      const metadataKey = `${address}-${chainId}`;
      metadataMap.set(metadataKey, metadata);
    });

    return metadataMap;
  } catch (error) {
    console.error("Error fetching tokens metadata:", error);
    throw error;
  }
}

export async function getPortfolio(address: string): Promise<PortfolioItem[]> {
  console.log("getPortfolio", address);
  try {
    const allTokens: PortfolioItem[] = [];

    await Promise.all(
      alchemyClients.map(async ({ chainId, client }) => {
        const { tokenBalances } = await client.core.getTokenBalances(address);
        const nativeBalance = await client.core.getBalance(address);

        console.log("tokenBalances", tokenBalances);
        console.log("nativeBalance", nativeBalance);

        const tokenBalancesMap = new Map<string, string>();

        // Filter non-zero token balances
        const nonZeroBalances = tokenBalances.filter((token) => {
          if (token.tokenBalance) {
            const balance = parseBalance(token.tokenBalance);
            return balance > BigInt(0);
          }
          return false;
        });

        console.log("nonZeroBalances", nonZeroBalances);

        // Add native token if balance > 0
        if (nativeBalance.toBigInt() > BigInt(0)) {
          nonZeroBalances.push({
            contractAddress: "0x0000000000000000000000000000000000000000",
            tokenBalance: nativeBalance.toString(),
            error: null,
          });
        }

        nonZeroBalances.forEach((token) => {
          tokenBalancesMap.set(token.contractAddress, token.tokenBalance!);
        });

        // Get all token addresses including native token
        const tokenAddresses = nonZeroBalances.map(
          (token) => token.contractAddress
        );

        // Get metadata for all tokens
        const metadataMap = await getTokensMetadata(
          tokenAddresses,
          chainId.toString()
        );

        // Add tokens with metadata to result
        tokenAddresses.forEach((address) => {
          const metadataKey = `${address}-${chainId}`;
          const metadata = metadataMap.get(metadataKey);
          if (metadata) {
            allTokens.push({
              balance: BigInt(tokenBalancesMap.get(address)!).toString(),
              token: metadata,
            });
          }
        });
      })
    );

    return allTokens;
  } catch (error) {
    console.error("Error fetching token holdings:", error);
    throw error;
  }
}

export function usePortfolio(address: string | undefined) {
  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => {
      if (!address) throw new Error("Address is required");
      return getPortfolio(address);
    },
    enabled: !!address,
  });
}
