type Hex = `0x${string}`;
type KeyType = "secp256r1" | "secp256k1" | "ed25519" | "schnorr";
type WalletSigner = {
    type: "wallet";
    data: {};
};
type KeySigner = {
    type: "key";
    data: {
        type: KeyType;
        publicKey: Hex;
    };
};
type MultiKeySigner = {
    type: "keys";
    data: {
        keys: {
            type: KeyType;
            publicKey: Hex;
        }[];
    };
};
type AccountSigner = {
    type: "account";
    data: {
        address: Hex;
    };
};
type Signer = WalletSigner | KeySigner | MultiKeySigner | AccountSigner;
type BasePermission = {
    type: string;
    isAdjustmentAllowed: boolean;
    data: Record<string, any>;
};
type Rule = {
    type: string;
    isAdjustmentAllowed: boolean;
    data: Record<string, any>;
};
type MetaMaskBasePermissionData = {
    justification?: string | null;
};
type NativeTokenStreamPermission = BasePermission & {
    type: 'native-token-stream';
    data: MetaMaskBasePermissionData & {
        initialAmount?: Hex | null;
        maxAmount?: Hex | null;
        amountPerSecond: Hex;
        startTime?: number | null;
    };
};
type NativeTokenPeriodicPermission = BasePermission & {
    type: 'native-token-periodic';
    data: MetaMaskBasePermissionData & {
        periodAmount: Hex;
        periodDuration: number;
        startTime?: number | null;
    };
};
type Erc20TokenStreamPermission = BasePermission & {
    type: 'erc20-token-stream';
    data: MetaMaskBasePermissionData & {
        initialAmount?: Hex | null;
        maxAmount?: Hex | null;
        amountPerSecond: Hex;
        startTime?: number | null;
        tokenAddress: Hex;
    };
};
type Erc20TokenPeriodicPermission = BasePermission & {
    type: 'erc20-token-periodic';
    data: MetaMaskBasePermissionData & {
        periodAmount: Hex;
        periodDuration: number;
        startTime?: number | null;
        tokenAddress: Hex;
    };
};
type PermissionTypes = NativeTokenStreamPermission | NativeTokenPeriodicPermission | Erc20TokenStreamPermission | Erc20TokenPeriodicPermission;
type PermissionRequest<TSigner extends Signer, TPermission extends PermissionTypes> = {
    chainId: Hex;
    address?: Hex;
    signer: TSigner;
    permission: TPermission;
    rules?: Rule[] | null;
};
type PermissionResponse<TSigner extends Signer, TPermission extends PermissionTypes> = PermissionRequest<TSigner, TPermission> & {
    context: Hex;
    dependencyInfo: {
        factory: Hex;
        factoryData: Hex;
    }[];
    signerMeta?: {
        userOpBuilder?: Hex;
        delegationManager?: Hex;
    };
};
type RevokeExecutionPermissionRequestParams = {
    permissionContext: Hex;
};
type RevokeExecutionPermissionResponseResult = {};

export type { AccountSigner, BasePermission, Erc20TokenPeriodicPermission, Erc20TokenStreamPermission, Hex, KeySigner, KeyType, MetaMaskBasePermissionData, MultiKeySigner, NativeTokenPeriodicPermission, NativeTokenStreamPermission, PermissionRequest, PermissionResponse, PermissionTypes, RevokeExecutionPermissionRequestParams, RevokeExecutionPermissionResponseResult, Rule, Signer, WalletSigner };
