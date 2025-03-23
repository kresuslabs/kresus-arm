import { config } from "@/config";
import { WagmiProvider } from "wagmi";

export function AssetsSection() {
  return <div>AssetsSection</div>;
}

export function Asset() {
  return <div>Asset</div>;
}

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <h1>Hello World</h1>
    </WagmiProvider>
  );
}
