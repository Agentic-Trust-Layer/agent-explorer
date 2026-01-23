import { Hex, Address, TypedData } from 'viem';

type UserOperationV07 = {
    sender: Hex;
    nonce: bigint;
    factory?: Hex;
    factoryData?: Hex;
    callData: Hex;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    paymaster?: Hex;
    paymasterVerificationGasLimit?: bigint;
    paymasterPostOpGasLimit?: bigint;
    paymasterData?: Hex;
    signature: Hex;
};
declare const SIGNABLE_USER_OP_TYPED_DATA: TypedData;
declare const signUserOperation: ({ privateKey, userOperation, entryPoint, chainId, name, address, version, }: {
    privateKey: Hex;
    userOperation: Omit<UserOperationV07, 'signature'>;
    entryPoint: {
        address: Address;
    };
    chainId: number;
    address: Address;
    name: 'HybridDeleGator' | 'MultiSigDeleGator';
    version?: string | undefined;
}) => Promise<`0x${string}`>;

export { SIGNABLE_USER_OP_TYPED_DATA as S, type UserOperationV07 as U, signUserOperation as s };
