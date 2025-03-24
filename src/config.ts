import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { base, worldchain } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Kresus ARM",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
  chains: [base, worldchain],
  transports: {
    [base.id]: http(),
    [worldchain.id]: http(),
  },
});

// same for Worldchain and Base
export const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
