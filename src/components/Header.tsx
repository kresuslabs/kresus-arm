import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 bg-[#000033]/90 border-b border-blue-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/kresus.svg" alt="Kresus Logo" width={30} height={30} />
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
