import { useEffect, useState } from "react";
import { http, PublicClient } from "viem";
import { createBundlerClient } from "viem/account-abstraction";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  publicClient: PublicClient;
}

export function TransactionModal({
  isOpen,
  onClose,
  txHash,
  publicClient,
}: TransactionModalProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">(
    "pending"
  );
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    console.log(txHash);
    if (!txHash || !isOpen || !publicClient.chain) return;

    const bundlerClient = createBundlerClient({
      client: publicClient,
      transport: http(
        `https://${publicClient.chain.name}-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      ),
    });

    const pollTransaction = async () => {
      try {
        const userOpReceipt = await bundlerClient.getUserOperationReceipt({
          hash: txHash as `0x${string}`,
        });

        console.log("userOpReceipt", userOpReceipt);

        if (userOpReceipt) {
          setReceipt(userOpReceipt);
          setStatus("confirmed");
          return;
        }
      } catch (error) {
        if (status !== "pending") {
          setStatus("failed");
        }
      }
    };

    const interval = setInterval(pollTransaction, 1000);
    return () => clearInterval(interval);
  }, [txHash, isOpen, publicClient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 w-[400px] border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Transaction Status</h2>

        <div className="flex flex-col items-center py-6">
          {status === "pending" && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-blue-500" />
          )}
          {status === "confirmed" && (
            <div className="text-green-500 text-6xl mb-4">✓</div>
          )}
          {status === "failed" && (
            <div className="text-red-500 text-6xl mb-4">×</div>
          )}

          <p className="text-lg mt-4 capitalize">{status}</p>

          {receipt && (
            <a
              href={`https://blockscan.com/tx/${receipt.userOpHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-light-blue-500 hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-light-blue-900 hover:bg-light-blue-800 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
