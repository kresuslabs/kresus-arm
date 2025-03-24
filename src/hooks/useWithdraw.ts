import { ENTRYPOINT_ADDRESS } from "@/config";
import { PortfolioItem } from "@/types/portfolio";
import { useMutation } from "@tanstack/react-query";
import { hexlify } from "ethers/lib/utils";
import {
  encodeFunctionData,
  erc20Abi,
  WalletClient,
  type Address,
  type PublicClient,
} from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { estimateUserOpGas } from "./gas";
import { getUserOpHash, UserOperationV0_7 } from "./op";
import { useContractWallet } from "./useContractWallet";

const makeErc20TransferCallData = (
  eowAddress: Address,
  asset: PortfolioItem
) => {
  const txCallData = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [eowAddress, BigInt(asset.balance)],
  });

  return encodeFunctionData({
    abi: [
      {
        name: "execute",
        type: "function",
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "execute",
    args: [asset.token.address as Address, BigInt(0), txCallData],
  });
};

const makeNativeTransferCallData = (
  eowAddress: Address,
  asset: PortfolioItem
) => {
  return encodeFunctionData({
    abi: [
      {
        name: "execute",
        type: "function",
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "execute",
    args: [eowAddress, BigInt(asset.balance), "0x"],
  });
};

const withdraw = async (
  asset: PortfolioItem,
  isNative: boolean,
  cowAddress?: Address,
  eowAddress?: Address,
  publicClient?: PublicClient,
  walletClient?: WalletClient
) => {
  if (!cowAddress || !walletClient || !publicClient || !eowAddress) {
    throw new Error("No wallet client or public client");
  }
  // Get the current nonce
  const nonce = (await publicClient.readContract({
    address: cowAddress,
    abi: [
      {
        inputs: [],
        name: "getNonce",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getNonce",
  })) as bigint;

  console.log("assetBalance", asset.balance);
  console.log("isNative", isNative);

  let userOp: Partial<UserOperationV0_7> = {
    sender: cowAddress,
    callData: isNative
      ? makeNativeTransferCallData(eowAddress, asset)
      : makeErc20TransferCallData(eowAddress, asset),
    nonce: hexlify(nonce),
  };

  const gasData = await estimateUserOpGas(userOp, publicClient);

  // @ts-ignore: gasData loose type, use zod
  userOp = {
    ...userOp,
    ...gasData,
    maxFeePerGas: hexlify(gasData.maxFeePerGas),
  };

  if (!publicClient.chain?.id) {
    throw new Error("No chain id");
  }

  const userOpHash = getUserOpHash(userOp, publicClient.chain?.id);

  const signature = await signUserOpHashWithViem(userOpHash, walletClient);

  userOp.signature = signature;

  console.log("signature", signature);

  const send = await publicClient.transport.request({
    method: "eth_sendUserOperation",
    params: [userOp, ENTRYPOINT_ADDRESS],
  });

  console.log("send", send);

  return send as `0x${string}`;
};

async function signUserOpHashWithViem(
  hash: string,
  walletClient: WalletClient
) {
  const signature = await walletClient.signMessage({
    message: { raw: hash as `0x${string}` },
    account: walletClient.account!,
  });

  return `0x00${signature.slice(2)}`; // Prepend signature type 0 for EOA
}

export const useWithdraw = function (asset: PortfolioItem) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address: eowAddress } = useAccount();
  const { data: cowAddress } = useContractWallet(eowAddress as Address);

  return useMutation({
    mutationKey: ["withdraw", asset.token.address],
    mutationFn: () =>
      withdraw(
        asset,
        asset.token.address === "0x0000000000000000000000000000000000000000",
        cowAddress,
        eowAddress,
        publicClient,
        walletClient
      ),
  });
};
