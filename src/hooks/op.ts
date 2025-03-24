import { ENTRYPOINT_ADDRESS } from "@/config";
import { type BigNumberish, type BytesLike } from "ethers";
import {
  defaultAbiCoder,
  hexConcat,
  hexlify,
  hexZeroPad,
  keccak256,
} from "ethers/lib/utils";
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
      ? keccak256(hexConcat([userOp?.factory, userOp?.factoryData]))
      : keccak256("0x"),
    keccak256(userOp.callData), //calldata
    hexConcat([
      //accountGasLimits
      hexZeroPad(hexlify(userOp.verificationGasLimit, { hexPad: "left" }), 16),
      hexZeroPad(hexlify(userOp.callGasLimit, { hexPad: "left" }), 16),
    ]),
    userOp.preVerificationGas, // preVerificationGas
    hexConcat([
      hexZeroPad(userOp.maxPriorityFeePerGas, 16),
      hexZeroPad(userOp.maxFeePerGas, 16),
    ]),
    // paymasterAndData
    userOp.paymaster
      ? keccak256(
          hexConcat([
            userOp.paymaster,
            hexZeroPad(
              hexlify(userOp.paymasterVerificationGasLimit, {
                hexPad: "left",
              }),
              16
            ),
            hexZeroPad(
              hexlify(userOp.paymasterPostOpGasLimit, {
                hexPad: "left",
              }),
              16
            ),
            userOp.paymasterData,
          ])
        )
      : keccak256("0x"),
  ];
};

export const getPackedData = (userOpData: BigNumberish[]) => {
  const packedData = defaultAbiCoder.encode(
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

  const enc = defaultAbiCoder.encode(
    ["bytes32", "address", "uint256"],
    [keccak256(packedData), ENTRYPOINT_ADDRESS, BigInt(chainId)]
  );

  const userOpHash = keccak256(enc);

  return userOpHash;
};
