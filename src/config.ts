import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Alchemy, Network } from "alchemy-sdk";
import { http } from "wagmi";
import { base, worldchain } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Kresus ARM",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
  chains: [base, worldchain],
  transports: {
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [worldchain.id]: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});

// same for Worldchain and Base
export const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
export const FACTORY_ADDRESS = "0xf5e92c74e20e03403f7f366e94eec7f62530d483";

export const SUPPORTED_NETWORKS = [
  { network: Network.BASE_MAINNET, chainId: base.id, chain: "base" },
  {
    network: Network.WORLDCHAIN_MAINNET,
    chainId: worldchain.id,
    chain: "worldchain",
  },
] as const;

export const alchemyClients = SUPPORTED_NETWORKS.map(
  ({ network, chainId, chain }) => ({
    client: new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network,
    }),
    chainId,
    chain,
    network,
  })
);
