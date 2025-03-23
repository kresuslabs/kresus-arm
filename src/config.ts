import { createConfig, http } from "wagmi";
import { base, worldchain } from "wagmi/chains";

export const config = createConfig({
  chains: [base, worldchain],
  transports: {
    [base.id]: http(),
    [worldchain.id]: http(),
  },
});
