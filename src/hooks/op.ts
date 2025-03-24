import { ENTRYPOINT_ADDRESS } from "@/config";
import ethers, { type BigNumberish, type BytesLike } from "ethers";
import { type Address } from "viem";

export interface UserOperationV0_7 {
  sender: Address;
  nonce: BigNumberish;
  factory: BytesLike;
  factoryData: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BytesLike;
  maxPriorityFeePerGas: BytesLike;
  paymasterVerificationGasLimit: BigNumberish;
  paymasterPostOpGasLimit: BigNumberish;
  paymaster: BytesLike;
  paymasterData: BytesLike;
  signature: BytesLike;
}

export const getUserOpArray = (userOp: UserOperationV0_7) => {
  return [
    userOp.sender, //sender
    userOp.nonce, //nonce
    // initCode
    userOp?.factory
      ? ethers.utils.keccak256(
          ethers.utils.hexConcat([userOp?.factory, userOp?.factoryData])
        )
      : ethers.utils.keccak256("0x"),
    ethers.utils.keccak256(userOp.callData), //calldata
    ethers.utils.hexConcat([
      //accountGasLimits
      ethers.utils.hexZeroPad(
        ethers.utils.hexlify(userOp.verificationGasLimit, { hexPad: "left" }),
        16
      ),
      ethers.utils.hexZeroPad(
        ethers.utils.hexlify(userOp.callGasLimit, { hexPad: "left" }),
        16
      ),
    ]),
    userOp.preVerificationGas, // preVerificationGas
    ethers.utils.hexConcat([
      ethers.utils.hexZeroPad(userOp.maxPriorityFeePerGas, 16),
      ethers.utils.hexZeroPad(userOp.maxFeePerGas, 16),
    ]),
    // paymasterAndData
    userOp.paymaster
      ? ethers.utils.keccak256(
          ethers.utils.hexConcat([
            userOp.paymaster,
            ethers.utils.hexZeroPad(
              ethers.utils.hexlify(userOp.paymasterVerificationGasLimit, {
                hexPad: "left",
              }),
              16
            ),
            ethers.utils.hexZeroPad(
              ethers.utils.hexlify(userOp.paymasterPostOpGasLimit, {
                hexPad: "left",
              }),
              16
            ),
            userOp.paymasterData,
          ])
        )
      : ethers.utils.keccak256("0x"),
  ];
};

export const getPackedData = (userOpData: BigNumberish[]) => {
  const packedData = ethers.utils.defaultAbiCoder.encode(
    [
      "address",
      "uint256",
      "bytes32",
      "bytes32",
      "bytes32",
      "uint256",
      "bytes32",
      "bytes32",
    ],
    userOpData
  );

  return packedData;
};

export const getUserOpHash = (
  userOp: Partial<UserOperationV0_7>,
  chainId: number
) => {
  const userOpData = getUserOpArray(userOp as UserOperationV0_7);

  const packedData = getPackedData(userOpData);

  const enc = ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "address", "uint256"],
    [ethers.utils.keccak256(packedData), ENTRYPOINT_ADDRESS, BigInt(chainId)]
  );

  const userOpHash = ethers.utils.keccak256(enc);

  return userOpHash;
};
