import { ENTRYPOINT_ADDRESS } from "@/config";
import type { PublicClient } from "viem";
import type { UserOperationV0_7 } from "./op";

const DUMMY_SIGNATURE =
  "0x00fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

export const estimateUserOpGas = async (
  userOp: Partial<UserOperationV0_7>,
  publicClient: PublicClient
) => {
  const [block, maxPriorityFeePerGas, gasData] = await Promise.all([
    publicClient.getBlock(),
    // Custom RPC call for rundler
    publicClient.transport.request({ method: "rundler_maxPriorityFeePerGas" }),
    publicClient.transport.request({
      method: "eth_estimateUserOperationGas",
      params: [
        { ...userOp, signature: DUMMY_SIGNATURE as `0x${string}` },
        ENTRYPOINT_ADDRESS,
      ],
    }),
  ]).catch((error) => {
    console.error("error", JSON.stringify(error, null, 2));
    throw error;
  });

  if (!block.baseFeePerGas || !maxPriorityFeePerGas || !gasData) {
    throw new Error("Failed to estimate gas");
  }

  // Add 50% buffer to base fee
  const baseFeePerGas = (block.baseFeePerGas * BigInt(150)) / BigInt(100);

  // Add 25% buffer to priority fee
  const adjMaxPriorityFeePerGas =
    (BigInt(maxPriorityFeePerGas as bigint) * BigInt(125)) / BigInt(100);

  const maxFeePerGas = baseFeePerGas + adjMaxPriorityFeePerGas;

  return {
    ...gasData,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
};
