import { ANY_BENEFICIARY, ROOT_AUTHORITY } from '@metamask/delegation-core';
import * as viem from 'viem';
import { Client, Transport, Chain, Account, Abi, Address, Hex } from 'viem';
import { l as DelegationStruct } from './delegation-CCMAKs7W.js';
import { D as Delegation, E as ExecutionMode, k as ExecutionStruct, R as Redemption } from './types-Bwksz_U6.js';

declare const NAME$1 = "DelegationManager";
declare const VERSION$1 = "1.3.0";
declare const DOMAIN_VERSION$1 = "1";

declare const constants$2_ANY_BENEFICIARY: typeof ANY_BENEFICIARY;
declare const constants$2_ROOT_AUTHORITY: typeof ROOT_AUTHORITY;
declare namespace constants$2 {
  export { constants$2_ANY_BENEFICIARY as ANY_BENEFICIARY, DOMAIN_VERSION$1 as DOMAIN_VERSION, NAME$1 as NAME, constants$2_ROOT_AUTHORITY as ROOT_AUTHORITY, VERSION$1 as VERSION };
}

type P256Owner = {
    keyId: string;
    x: bigint;
    y: bigint;
};
type InitializedClient = Client<Transport, Chain, Account>;

type NarrowAbiToFunction<TAbi extends Abi, FunctionName extends string> = [
    Extract<TAbi[number], {
        type: 'function';
        name: FunctionName;
    }>[]
];
declare function isContractDeployed({ client, contractAddress, }: {
    client: Client;
    contractAddress: Address;
}): Promise<boolean>;
declare function isImplementationExpected({ client, contractAddress, expectedImplementationAddress, }: {
    client: Client;
    contractAddress: Address;
    expectedImplementationAddress: Address;
}): Promise<boolean>;
declare const encodeProxyCreationCode: ({ implementationAddress, initcode, }: {
    implementationAddress: Address;
    initcode: Hex;
}) => Hex;

type EncodeDisableDelegationParameters$1 = {
    delegation: Delegation;
};
type SimulateDisableDelegationParameters$1 = {
    client: Client;
    delegationManagerAddress: Address;
} & EncodeDisableDelegationParameters$1;
type ExecuteDisableDelegationParameters$1 = {
    client: InitializedClient;
    delegationManagerAddress: Address;
} & EncodeDisableDelegationParameters$1;
declare const simulate$y: ({ client, delegationManagerAddress, delegation, }: SimulateDisableDelegationParameters$1) => Promise<viem.SimulateContractReturnType<NarrowAbiToFunction<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "ANY_DELEGATE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ROOT_AUTHORITY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disabledDelegations";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "isDisabled";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getDelegationHash";
    readonly inputs: readonly [{
        readonly name: "_input";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "unpause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "DisabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EnabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Paused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RedeemedDelegation";
    readonly inputs: readonly [{
        readonly name: "rootDelegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "redeemer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDomain";
    readonly inputs: readonly [{
        readonly name: "domainHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "domainVersion";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Unpaused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AlreadyDisabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyEnabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "BatchDataLengthMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "CannotUseADisabledDelegation";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "EmptySignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EnforcedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExpectedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidAuthority";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegate";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegator";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidEOASignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidERC1271Signature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}], "disableDelegation">, "disableDelegation", [DelegationStruct], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$k: ({ client, delegationManagerAddress, delegation, }: ExecuteDisableDelegationParameters$1) => Promise<`0x${string}`>;
declare const encode$z: ({ delegation }: EncodeDisableDelegationParameters$1) => `0x${string}`;

type EncodeEnableDelegationParameters$1 = {
    delegation: Delegation;
};
type SimulateEnableDelegationParameters$1 = {
    client: Client;
    delegationManagerAddress: Address;
} & EncodeEnableDelegationParameters$1;
type ExecuteEnableDelegationParameters$1 = {
    client: InitializedClient;
    delegationManagerAddress: Address;
} & EncodeEnableDelegationParameters$1;
declare const simulate$x: ({ client, delegationManagerAddress, delegation, }: SimulateEnableDelegationParameters$1) => Promise<viem.SimulateContractReturnType<NarrowAbiToFunction<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "ANY_DELEGATE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ROOT_AUTHORITY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disabledDelegations";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "isDisabled";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getDelegationHash";
    readonly inputs: readonly [{
        readonly name: "_input";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "unpause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "DisabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EnabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Paused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RedeemedDelegation";
    readonly inputs: readonly [{
        readonly name: "rootDelegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "redeemer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDomain";
    readonly inputs: readonly [{
        readonly name: "domainHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "domainVersion";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Unpaused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AlreadyDisabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyEnabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "BatchDataLengthMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "CannotUseADisabledDelegation";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "EmptySignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EnforcedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExpectedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidAuthority";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegate";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegator";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidEOASignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidERC1271Signature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}], "enableDelegation">, "enableDelegation", [DelegationStruct], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$j: ({ client, delegationManagerAddress, delegation, }: ExecuteEnableDelegationParameters$1) => Promise<`0x${string}`>;
declare const encode$y: ({ delegation }: EncodeEnableDelegationParameters$1) => `0x${string}`;

type EncodeRedeemDelegationsParameters = {
    delegations: Delegation[][];
    modes: ExecutionMode[];
    executions: ExecutionStruct[][];
};
type SimulateRedeemDelegationsParameters = {
    client: Client;
    delegationManagerAddress: Address;
} & EncodeRedeemDelegationsParameters;
type ExecuteRedeemDelegationsParameters = {
    client: InitializedClient;
    delegationManagerAddress: Address;
} & EncodeRedeemDelegationsParameters;
declare const simulate$w: ({ client, delegationManagerAddress, delegations, modes, executions, }: SimulateRedeemDelegationsParameters) => Promise<viem.SimulateContractReturnType<NarrowAbiToFunction<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "ANY_DELEGATE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ROOT_AUTHORITY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disabledDelegations";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "isDisabled";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getDelegationHash";
    readonly inputs: readonly [{
        readonly name: "_input";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "unpause";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "DisabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EnabledDelegation";
    readonly inputs: readonly [{
        readonly name: "delegationHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegate";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Paused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RedeemedDelegation";
    readonly inputs: readonly [{
        readonly name: "rootDelegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "redeemer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegation";
        readonly type: "tuple";
        readonly indexed: false;
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDomain";
    readonly inputs: readonly [{
        readonly name: "domainHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "domainVersion";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Unpaused";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AlreadyDisabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyEnabled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "BatchDataLengthMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "CannotUseADisabledDelegation";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "EmptySignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EnforcedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExpectedPause";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidAuthority";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegate";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDelegator";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidEOASignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidERC1271Signature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}], "redeemDelegations">, "redeemDelegations", [`0x${string}`[], ExecutionMode[], `0x${string}`[]], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$i: ({ client, delegationManagerAddress, delegations, modes, executions, }: ExecuteRedeemDelegationsParameters) => Promise<`0x${string}`>;
declare const encode$x: ({ delegations, modes, executions, }: EncodeRedeemDelegationsParameters) => `0x${string}`;

declare namespace encode$w {
  export { encode$z as disableDelegation, encode$y as enableDelegation, encode$x as redeemDelegations };
}

declare namespace execute$h {
  export { execute$k as disableDelegation, execute$j as enableDelegation, execute$i as redeemDelegations };
}

type ReadDisabledDelegationsParameters = {
    client: Client;
    contractAddress: Address;
    delegationHash: Hex;
};
declare const read$_: ({ client, contractAddress, delegationHash, }: ReadDisabledDelegationsParameters) => Promise<boolean>;

type ReadGetAnyDelegateParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$Z: ({ client, contractAddress, }: ReadGetAnyDelegateParameters) => Promise<`0x${string}`>;

type ReadGetRootAuthorityParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$Y: ({ client, contractAddress, }: ReadGetRootAuthorityParameters) => Promise<`0x${string}`>;

declare namespace read$X {
  export { read$_ as disabledDelegations, read$Z as getAnyDelegate, read$Y as getRootAuthority };
}

declare namespace simulate$v {
  export { simulate$y as disableDelegation, simulate$x as enableDelegation, simulate$w as redeemDelegations };
}

declare namespace index$k {
  export { constants$2 as constants, encode$w as encode, execute$h as execute, read$X as read, simulate$v as simulate };
}

type SimulateDisableDelegationParameters = {
    client: Client;
    delegationManagerAddress: Address;
    delegation: Delegation;
};
type EncodeDisableDelegationParameters = {
    delegation: Delegation;
};
type ExecuteDisableDelegationParameters = {
    client: InitializedClient;
    delegationManagerAddress: Address;
    delegation: Delegation;
};
declare const simulate$u: ({ client, delegationManagerAddress, delegation, }: SimulateDisableDelegationParameters) => Promise<viem.SimulateContractReturnType<NarrowAbiToFunction<readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "disableDelegation">, "disableDelegation", [DelegationStruct], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$g: ({ client, delegationManagerAddress, delegation, }: ExecuteDisableDelegationParameters) => Promise<`0x${string}`>;
declare const encode$v: ({ delegation }: EncodeDisableDelegationParameters) => `0x${string}`;

type SimulateEnableDelegationParameters = {
    client: Client;
    delegationManagerAddress: Address;
    delegation: Delegation;
};
type EncodeEnableDelegationParameters = {
    delegation: Delegation;
};
type ExecuteEnableDelegationParameters = {
    client: InitializedClient;
    delegationManagerAddress: Address;
    delegation: Delegation;
};
declare const simulate$t: ({ client, delegationManagerAddress, delegation, }: SimulateEnableDelegationParameters) => Promise<viem.SimulateContractReturnType<NarrowAbiToFunction<readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "enableDelegation">, "enableDelegation", [DelegationStruct], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$f: ({ client, delegationManagerAddress, delegation, }: ExecuteEnableDelegationParameters) => Promise<`0x${string}`>;
declare const encode$u: ({ delegation }: EncodeEnableDelegationParameters) => `0x${string}`;

type SimulateExecuteParameters = {
    client: Client;
    contractAddress: Address;
    execution: ExecutionStruct;
};
type EncodeExecuteParameters = {
    execution: ExecutionStruct;
};
type ExecuteExecuteParameters = {
    client: InitializedClient;
    contractAddress: Address;
    execution: ExecutionStruct;
};
declare const simulate$s: ({ client, contractAddress, execution, }: SimulateExecuteParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "execute", [ExecutionStruct], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}], viem.Account | undefined>>;
declare const execute$e: ({ client, contractAddress, execution, }: ExecuteExecuteParameters) => Promise<`0x${string}`>;
declare const encode$t: ({ execution }: EncodeExecuteParameters) => `0x${string}`;

type SimulateExecuteWithModeParameters = {
    client: Client;
    contractAddress: Address;
} & EncodeExecuteWithModeParameters;
type EncodeExecuteWithModeParameters = {
    mode: ExecutionMode;
    executions: ExecutionStruct[];
};
type ExecuteExecuteWithModeParameters = {
    client: InitializedClient;
    contractAddress: Address;
} & EncodeExecuteWithModeParameters;
declare const simulate$r: ({ client, contractAddress, mode, executions, }: SimulateExecuteWithModeParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "execute", [ExecutionMode, `0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}], viem.Account | undefined>>;
declare const execute$d: ({ client, contractAddress, mode, executions, }: ExecuteExecuteWithModeParameters) => Promise<`0x${string}`>;
declare const encode$s: ({ mode, executions, }: EncodeExecuteWithModeParameters) => `0x${string}`;

type IsValidSignatureParameters = {
    client: Client;
    contractAddress: Address;
    hash: Hex;
    signature: Hex;
};
type EncodeIsValidSignatureParameters = {
    hash: Hex;
    signature: Hex;
};
declare const read$W: ({ client, contractAddress, hash, signature, }: IsValidSignatureParameters) => Promise<`0x${string}`>;
declare const encode$r: ({ hash, signature, }: EncodeIsValidSignatureParameters) => `0x${string}`;

type SimulateUpgradeToAndCallParameters = {
    client: Client;
    contractAddress: Address;
} & EncodeUpgradeToAndCallParameters;
type EncodeUpgradeToAndCallParameters = {
    implementation: Address;
    data: Hex;
};
type ExecuteUpgradeToAndCallParameters = {
    client: InitializedClient;
    contractAddress: Address;
} & EncodeUpgradeToAndCallParameters;
declare const simulate$q: ({ client, contractAddress, implementation, data, }: SimulateUpgradeToAndCallParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "upgradeToAndCall", [`0x${string}`, `0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}], viem.Account | undefined>>;
declare const execute$c: ({ client, contractAddress, implementation, data, }: ExecuteUpgradeToAndCallParameters) => Promise<`0x${string}`>;
declare const encode$q: ({ implementation, data, }: EncodeUpgradeToAndCallParameters) => `0x${string}`;

declare namespace encode$p {
  export { encode$v as disableDelegation, encode$u as enableDelegation, encode$t as execute, encode$s as executeWithMode, encode$r as isValidSignature, encode$q as upgradeToAndCall };
}

declare namespace execute$b {
  export { execute$g as disableDelegation, execute$f as enableDelegation, execute$e as execute, execute$d as executeWithMode, execute$c as upgradeToAndCall };
}

type ReadGetDelegationManagerParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$V: ({ client, contractAddress, }: ReadGetDelegationManagerParameters) => Promise<`0x${string}`>;

type ReadGetDepositParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$U: ({ client, contractAddress, }: ReadGetDepositParameters) => Promise<bigint>;

type ReadGetEntryPointParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$T: ({ client, contractAddress, }: ReadGetEntryPointParameters) => Promise<`0x${string}`>;

type ReadGetNonceParameters$1 = {
    client: Client;
    contractAddress: Address;
    key?: bigint;
};
declare const read$S: ({ client, contractAddress, key, }: ReadGetNonceParameters$1) => Promise<bigint>;

type ReadGetProxyImplementationParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$R: ({ client, contractAddress, }: ReadGetProxyImplementationParameters) => Promise<`0x${string}`>;

type ReadGetProxyVersionParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$Q: ({ client, contractAddress, }: ReadGetProxyVersionParameters) => Promise<bigint>;

declare namespace read$P {
  export { read$V as getDelegationManager, read$U as getDeposit, read$T as getEntryPoint, read$S as getNonce, read$R as getProxyImplementation, read$Q as getProxyVersion, read$W as isValidSignature };
}

declare namespace simulate$p {
  export { simulate$u as disableDelegation, simulate$t as enableDelegation, simulate$s as execute, simulate$r as executeWithMode, simulate$q as upgradeToAndCall };
}

declare namespace index$j {
  export { encode$p as encode, execute$b as execute, read$P as read, simulate$p as simulate };
}

type ReadGetContractNameParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$O: ({ client, contractAddress, }: ReadGetContractNameParameters) => Promise<string>;

type ReadGetContractVersionParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$N: ({ client, contractAddress, }: ReadGetContractVersionParameters) => Promise<string>;

type ReadGetDomainVersionParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$M: ({ client, contractAddress, }: ReadGetDomainVersionParameters) => Promise<string>;

declare namespace read$L {
  export { read$O as getContractName, read$N as getContractVersion, read$M as getDomainVersion };
}

declare namespace index$i {
  export { read$L as read };
}

type ReadGetNonceParameters = {
    client: Client;
    entryPoint: Address;
    contractAddress: Address;
    key: bigint;
};
declare const read$K: ({ client, entryPoint, contractAddress, key, }: ReadGetNonceParameters) => Promise<bigint>;

declare namespace read$J {
  export { read$K as entryPointGetNonce };
}

declare namespace index$h {
  export { read$J as read };
}

type ReadGetAvailableAmountParameters$4 = {
    client: Client;
    contractAddress: Address;
    delegationHash: Hex;
    delegationManager: Address;
    terms: Hex;
};
declare const read$I: ({ client, contractAddress, delegationHash, delegationManager, terms, }: ReadGetAvailableAmountParameters$4) => Promise<{
    availableAmount: bigint;
    isNewPeriod: boolean;
    currentPeriod: bigint;
}>;

declare namespace read$H {
  export { read$I as getAvailableAmount };
}

declare namespace index$g {
  export { read$H as read };
}

type ReadGetAvailableAmountParameters$3 = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
    terms: Hex;
};
declare const read$G: ({ client, contractAddress, delegationManager, delegationHash, terms, }: ReadGetAvailableAmountParameters$3) => Promise<{
    availableAmount: bigint;
}>;

declare namespace read$F {
  export { read$G as getAvailableAmount };
}

declare namespace index$f {
  export { read$F as read };
}

type ReadGetSpentAmountParameters$1 = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
};
declare const read$E: ({ client, contractAddress, delegationManager, delegationHash, }: ReadGetSpentAmountParameters$1) => Promise<bigint>;

type ReadGetTermsInfoParameters$5 = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
type TermsData$1 = {
    allowedContract: Address;
    maxTokens: bigint;
};
declare const read$D: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters$5) => Promise<TermsData$1>;

declare namespace read$C {
  export { read$E as getSpentAmount, read$D as getTermsInfo };
}

declare namespace index$e {
  export { read$C as read };
}

type ReadGetKeyParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
    keyId: string;
};
declare const read$B: ({ client, hybridDeleGatorAddress, keyId, }: ReadGetKeyParameters) => Promise<readonly [bigint, bigint]>;

type ReadGetKeyIdHashesParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
};
declare const read$A: ({ client, hybridDeleGatorAddress, }: ReadGetKeyIdHashesParameters) => Promise<readonly `0x${string}`[]>;

type ReadGetKeyIdHashesCountParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
};
declare const read$z: ({ client, hybridDeleGatorAddress, }: ReadGetKeyIdHashesCountParameters) => Promise<bigint>;

declare namespace read$y {
  export { read$B as getKey, read$A as getKeyIdHashes, read$z as getKeyIdHashesCount };
}

type EncodeAddKeyParameters = {
    p256Owner: P256Owner;
};
type SimulateAddKeyParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
} & EncodeAddKeyParameters;
declare const simulate$o: ({ client, hybridDeleGatorAddress, p256Owner, }: SimulateAddKeyParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "x_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashes";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashesCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "_newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "keyId";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "CannotRemoveLastSigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InputLengthsMismatch";
    readonly inputs: readonly [{
        readonly name: "keyIdsLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "xValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "yValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidEmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeyAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyDoesNotExist";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyNotOnCurve";
    readonly inputs: readonly [{
        readonly name: "x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SignersCannotBeEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "addKey", [string, bigint, bigint], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$o: ({ p256Owner }: EncodeAddKeyParameters) => `0x${string}`;

type EncodeInitializeParameters$1 = {
    eoaOwner: Address;
    p256Owners: P256Owner[];
};
type SimulateInitializeParameters$1 = {
    client: Client;
    hybridDeleGatorAddress: Address;
} & EncodeInitializeParameters$1;
declare const simulate$n: ({ client, hybridDeleGatorAddress, eoaOwner, p256Owners, }: SimulateInitializeParameters$1) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "x_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashes";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashesCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "_newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "keyId";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "CannotRemoveLastSigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InputLengthsMismatch";
    readonly inputs: readonly [{
        readonly name: "keyIdsLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "xValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "yValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidEmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeyAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyDoesNotExist";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyNotOnCurve";
    readonly inputs: readonly [{
        readonly name: "x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SignersCannotBeEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "initialize", [`0x${string}`, string[], bigint[], bigint[]], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$n: ({ eoaOwner, p256Owners, }: EncodeInitializeParameters$1) => `0x${string}`;

type EncodeReinitializeParameters$1 = {
    version: number;
    eoaOwner: Address;
    p256Owners: P256Owner[];
    removeExistingP256Owners: boolean;
};
type SimulateReinitializeParameters$1 = {
    client: Client;
    hybridDeleGatorAddress: Address;
} & EncodeReinitializeParameters$1;
declare const simulate$m: ({ client, hybridDeleGatorAddress, version, eoaOwner, p256Owners, removeExistingP256Owners, }: SimulateReinitializeParameters$1) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "x_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashes";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashesCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "_newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "keyId";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "CannotRemoveLastSigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InputLengthsMismatch";
    readonly inputs: readonly [{
        readonly name: "keyIdsLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "xValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "yValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidEmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeyAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyDoesNotExist";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyNotOnCurve";
    readonly inputs: readonly [{
        readonly name: "x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SignersCannotBeEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "reinitialize", [number, `0x${string}`, string[], bigint[], bigint[], boolean], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$m: ({ version, eoaOwner, p256Owners, removeExistingP256Owners, }: EncodeReinitializeParameters$1) => `0x${string}`;

type EncodeRemoveKeyParameters = {
    keyId: string;
};
type SimulateRemoveKeyParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
} & EncodeRemoveKeyParameters;
declare const simulate$l: ({ client, hybridDeleGatorAddress, keyId, }: SimulateRemoveKeyParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "x_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashes";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashesCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "_newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "keyId";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "CannotRemoveLastSigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InputLengthsMismatch";
    readonly inputs: readonly [{
        readonly name: "keyIdsLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "xValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "yValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidEmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeyAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyDoesNotExist";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyNotOnCurve";
    readonly inputs: readonly [{
        readonly name: "x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SignersCannotBeEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "removeKey", [string], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$l: ({ keyId }: EncodeRemoveKeyParameters) => `0x${string}`;

type EncodeUpdateSignersParameters = {
    eoaOwner: Address;
    p256Owners: P256Owner[];
};
type SimulateUpdateSignersParameters = {
    client: Client;
    hybridDeleGatorAddress: Address;
} & EncodeUpdateSignersParameters;
declare const simulate$k: ({ client, hybridDeleGatorAddress, eoaOwner, p256Owners, }: SimulateUpdateSignersParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "x_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashes";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getKeyIdHashesCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_deleteP256Keys";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKey";
    readonly inputs: readonly [{
        readonly name: "_keyId";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "_newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "keyId";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedP256Key";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "x";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "CannotRemoveLastSigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InputLengthsMismatch";
    readonly inputs: readonly [{
        readonly name: "keyIdsLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "xValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "yValuesLength";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidEmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeyAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyDoesNotExist";
    readonly inputs: readonly [{
        readonly name: "keyIdHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "KeyNotOnCurve";
    readonly inputs: readonly [{
        readonly name: "x";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "y";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SignersCannotBeEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "updateSigners", [`0x${string}`, string[], bigint[], bigint[]], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "updateSigners";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_keyIds";
        readonly type: "string[]";
        readonly internalType: "string[]";
    }, {
        readonly name: "_xValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "_yValues";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$k: ({ eoaOwner, p256Owners, }: EncodeUpdateSignersParameters) => `0x${string}`;

declare namespace encode$j {
  export { encode$o as addKey, encode$n as initializeHybridDeleGator, encode$m as reinitializeHybridDeleGator, encode$l as removeKey, encode$k as updateSigners };
}

declare namespace simulate$j {
  export { simulate$o as addKey, simulate$n as initializeHybridDeleGator, simulate$m as reinitializeHybridDeleGator, simulate$l as removeKey, simulate$k as updateSigners };
}

declare const NAME = "HybridDeleGator";
declare const VERSION = "1.3.0";
declare const DOMAIN_VERSION = "1";

declare const constants$1_ANY_BENEFICIARY: typeof ANY_BENEFICIARY;
declare const constants$1_DOMAIN_VERSION: typeof DOMAIN_VERSION;
declare const constants$1_NAME: typeof NAME;
declare const constants$1_ROOT_AUTHORITY: typeof ROOT_AUTHORITY;
declare const constants$1_VERSION: typeof VERSION;
declare namespace constants$1 {
  export { constants$1_ANY_BENEFICIARY as ANY_BENEFICIARY, constants$1_DOMAIN_VERSION as DOMAIN_VERSION, constants$1_NAME as NAME, constants$1_ROOT_AUTHORITY as ROOT_AUTHORITY, constants$1_VERSION as VERSION };
}

declare namespace index$d {
  export { constants$1 as constants, encode$j as encode, read$y as read, simulate$j as simulate };
}

type ReadGetIsUsedParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegator: Address;
    id: bigint;
};
declare const read$x: ({ client, contractAddress, delegationManager, delegator, id, }: ReadGetIsUsedParameters) => Promise<boolean>;

type ReadGetTermsInfoParameters$4 = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
declare const read$w: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters$4) => Promise<bigint>;

declare namespace read$v {
  export { read$x as getIsUsed, read$w as getTermsInfo };
}

declare namespace index$c {
  export { read$v as read };
}

type ReadCallCountsParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
};
declare const read$u: ({ client, contractAddress, delegationManager, delegationHash, }: ReadCallCountsParameters) => Promise<bigint>;

type ReadGetTermsInfoParameters$3 = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
declare const read$t: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters$3) => Promise<bigint>;

declare namespace read$s {
  export { read$u as callCounts, read$t as getTermsInfo };
}

declare namespace index$b {
  export { read$s as read };
}

type ReadGetMaxNumberOfSignersParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
};
declare const read$r: ({ client, multiSigDeleGatorAddress, }: ReadGetMaxNumberOfSignersParameters) => Promise<bigint>;

type ReadGetSignersParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
};
declare const read$q: ({ client, multiSigDeleGatorAddress, }: ReadGetSignersParameters) => Promise<readonly `0x${string}`[]>;

type ReadGetSignersCountParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
};
declare const read$p: ({ client, multiSigDeleGatorAddress, }: ReadGetSignersCountParameters) => Promise<bigint>;

type ReadGetThresholdParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
};
declare const read$o: ({ client, multiSigDeleGatorAddress, }: ReadGetThresholdParameters) => Promise<bigint>;

type ReadIsSignerParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
    signer: Address;
};
declare const read$n: ({ client, multiSigDeleGatorAddress, signer, }: ReadIsSignerParameters) => Promise<boolean>;

declare namespace read$m {
  export { read$r as getMaxNumberOfSigners, read$q as getSigners, read$p as getSignersCount, read$o as getThreshold, read$n as isSigner };
}

type EncodeAddSignerParameters = {
    signer: Address;
};
type SimulateAddSignerParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeAddSignerParameters;
declare const simulate$i: ({ client, multiSigDeleGatorAddress, signer, }: SimulateAddSignerParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "addSigner", [`0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$i: ({ signer }: EncodeAddSignerParameters) => `0x${string}`;

type EncodeInitializeParameters = {
    owners: Address[];
    threshold: bigint;
};
type SimulateInitializeParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeInitializeParameters;
declare const simulate$h: ({ client, multiSigDeleGatorAddress, owners, threshold, }: SimulateInitializeParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "initialize", [`0x${string}`[], bigint], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$h: ({ owners, threshold }: EncodeInitializeParameters) => `0x${string}`;

type EncodeReinitializeParameters = {
    version: bigint;
    owners: Address[];
    threshold: bigint;
    removeExistingOwners: boolean;
};
type SimulateReinitializeParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeReinitializeParameters;
declare const simulate$g: ({ client, multiSigDeleGatorAddress, version, owners, threshold, removeExistingOwners, }: SimulateReinitializeParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "reinitialize", [bigint, `0x${string}`[], bigint, boolean], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$g: ({ version, owners, threshold, removeExistingOwners, }: EncodeReinitializeParameters) => `0x${string}`;

type EncodeRemoveSignerParameters = {
    signer: Address;
};
type SimulateRemoveSignerParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeRemoveSignerParameters;
declare const simulate$f: ({ client, multiSigDeleGatorAddress, signer, }: SimulateRemoveSignerParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "removeSigner", [`0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$f: ({ signer }: EncodeRemoveSignerParameters) => `0x${string}`;

type EncodeReplaceSignerParameters = {
    oldSigner: Address;
    newSigner: Address;
};
type SimulateReplaceSignerParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeReplaceSignerParameters;
declare const simulate$e: ({ client, multiSigDeleGatorAddress, oldSigner, newSigner, }: SimulateReplaceSignerParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "replaceSigner", [`0x${string}`, `0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$e: ({ oldSigner, newSigner, }: EncodeReplaceSignerParameters) => `0x${string}`;

type EncodeUpdateMultiSigParametersParameters = {
    owners: Address[];
    threshold: bigint;
    removeExistingOwners: boolean;
};
type SimulateUpdateMultiSigParametersParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeUpdateMultiSigParametersParameters;
declare const simulate$d: ({ client, multiSigDeleGatorAddress, owners, threshold, removeExistingOwners, }: SimulateUpdateMultiSigParametersParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "updateMultiSigParameters", [`0x${string}`[], bigint, boolean], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$d: ({ owners, threshold, removeExistingOwners, }: EncodeUpdateMultiSigParametersParameters) => `0x${string}`;

type EncodeUpdateThresholdParameters = {
    threshold: bigint;
};
type SimulateUpdateThresholdParameters = {
    client: Client;
    multiSigDeleGatorAddress: Address;
} & EncodeUpdateThresholdParameters;
declare const simulate$c: ({ client, multiSigDeleGatorAddress, threshold, }: SimulateUpdateThresholdParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }, {
        readonly name: "_entryPoint";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "DOMAIN_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_NUMBER_OF_SIGNERS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "NAME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PACKED_USER_OP_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UPGRADE_INTERFACE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addSigner";
    readonly inputs: readonly [{
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delegationManager";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDelegationManager";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enableDelegation";
    readonly inputs: readonly [{
        readonly name: "_delegation";
        readonly type: "tuple";
        readonly internalType: "struct Delegation";
        readonly components: readonly [{
            readonly name: "delegate";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "delegator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "authority";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "caveats";
            readonly type: "tuple[]";
            readonly internalType: "struct Caveat[]";
            readonly components: readonly [{
                readonly name: "enforcer";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "terms";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }, {
                readonly name: "args";
                readonly type: "bytes";
                readonly internalType: "bytes";
            }];
        }, {
            readonly name: "salt";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "entryPoint";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IEntryPoint";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_execution";
        readonly type: "tuple";
        readonly internalType: "struct Execution";
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "executeFromExecutor";
    readonly inputs: readonly [{
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "_executionCalldata";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "returnData_";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getDeposit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDomainHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImplementation";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [{
        readonly name: "_key";
        readonly type: "uint192";
        readonly internalType: "uint192";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPackedUserOperationTypedDataHash";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigners";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSignersCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getThreshold";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isDelegationDisabled";
    readonly inputs: readonly [{
        readonly name: "_delegationHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isSigner";
    readonly inputs: readonly [{
        readonly name: "_addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidSignature";
    readonly inputs: readonly [{
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "magicValue_";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155BatchReceived";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC1155Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "onERC721Received";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proxiableUUID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "redeemDelegations";
    readonly inputs: readonly [{
        readonly name: "_permissionContexts";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }, {
        readonly name: "_modes";
        readonly type: "bytes32[]";
        readonly internalType: "ModeCode[]";
    }, {
        readonly name: "_executionCallDatas";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reinitialize";
    readonly inputs: readonly [{
        readonly name: "_version";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "replaceSigner";
    readonly inputs: readonly [{
        readonly name: "_oldSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_newSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "_interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateMultiSigParameters";
    readonly inputs: readonly [{
        readonly name: "_signers";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_clearSigners";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCall";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "upgradeToAndCallAndRetainStorage";
    readonly inputs: readonly [{
        readonly name: "_newImplementation";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "_userOp";
        readonly type: "tuple";
        readonly internalType: "struct PackedUserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "accountGasLimits";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasFees";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_missingAccountFunds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdrawDeposit";
    readonly inputs: readonly [{
        readonly name: "_withdrawAddress";
        readonly type: "address";
        readonly internalType: "address payable";
    }, {
        readonly name: "_withdrawAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "AddedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClearedStorage";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EIP712DomainChanged";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemovedSigner";
    readonly inputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReplacedSigner";
    readonly inputs: readonly [{
        readonly name: "oldSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newSigner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentPrefund";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetDelegationManager";
    readonly inputs: readonly [{
        readonly name: "newDelegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IDelegationManager";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SetEntryPoint";
    readonly inputs: readonly [{
        readonly name: "entryPoint";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "contract IEntryPoint";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TryExecuteUnsuccessful";
    readonly inputs: readonly [{
        readonly name: "batchExecutionindex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "result";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "UpdatedThreshold";
    readonly inputs: readonly [{
        readonly name: "threshold";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Upgraded";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AddressEmptyCode";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignature";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureLength";
    readonly inputs: readonly [{
        readonly name: "length";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ECDSAInvalidSignatureS";
    readonly inputs: readonly [{
        readonly name: "s";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967InvalidImplementation";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "ERC1967NonPayable";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExecutionFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedInnerCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientSigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidShortString";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSignerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidThreshold";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotASigner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotDelegationManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPoint";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEntryPointOrSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotSelf";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StringTooLong";
    readonly inputs: readonly [{
        readonly name: "str";
        readonly type: "string";
        readonly internalType: "string";
    }];
}, {
    readonly type: "error";
    readonly name: "TooManySigners";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnauthorizedCallContext";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UUPSUnsupportedProxiableUUID";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedCallType";
    readonly inputs: readonly [{
        readonly name: "callType";
        readonly type: "bytes1";
        readonly internalType: "CallType";
    }];
}, {
    readonly type: "error";
    readonly name: "UnsupportedExecType";
    readonly inputs: readonly [{
        readonly name: "execType";
        readonly type: "bytes1";
        readonly internalType: "ExecType";
    }];
}], "updateThreshold", [bigint], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "updateThreshold";
    readonly inputs: readonly [{
        readonly name: "_threshold";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$c: ({ threshold }: EncodeUpdateThresholdParameters) => `0x${string}`;

declare namespace encode$b {
  export { encode$i as addSigner, encode$h as initializeMultiSigDeleGator, encode$g as reinitializeMultiSigDeleGator, encode$f as removeSigner, encode$e as replaceSigner, encode$d as updateMultiSigParameters, encode$c as updateThreshold };
}

declare namespace simulate$b {
  export { simulate$i as addSigner, simulate$h as initializeMultiSigDeleGator, simulate$g as reinitializeMultiSigDeleGator, simulate$f as removeSigner, simulate$e as replaceSigner, simulate$d as updateMultiSigParameters, simulate$c as updateThreshold };
}

declare const MAX_NUMBER_OF_SIGNERS = 30;

declare const constants_MAX_NUMBER_OF_SIGNERS: typeof MAX_NUMBER_OF_SIGNERS;
declare namespace constants {
  export { constants_MAX_NUMBER_OF_SIGNERS as MAX_NUMBER_OF_SIGNERS };
}

declare const index$a_constants: typeof constants;
declare namespace index$a {
  export { index$a_constants as constants, encode$b as encode, read$m as read, simulate$b as simulate };
}

type ReadGetAvailableAmountParameters$2 = {
    client: Client;
    contractAddress: Address;
    delegationHash: Hex;
    delegationManager: Address;
    terms: Hex;
    args: Hex;
};
declare const read$l: ({ client, contractAddress, delegationHash, delegationManager, terms, args, }: ReadGetAvailableAmountParameters$2) => Promise<{
    availableAmount: bigint;
    isNewPeriod: boolean;
    currentPeriod: bigint;
}>;

declare namespace read$k {
  export { read$l as getAvailableAmount };
}

declare namespace index$9 {
  export { read$k as read };
}

type ReadGetAvailableAmountParameters$1 = {
    client: Client;
    contractAddress: Address;
    delegationHash: Hex;
    delegationManager: Address;
    terms: Hex;
};
declare const read$j: ({ client, contractAddress, delegationHash, delegationManager, terms, }: ReadGetAvailableAmountParameters$1) => Promise<{
    availableAmount: bigint;
    isNewPeriod: boolean;
    currentPeriod: bigint;
}>;

declare namespace read$i {
  export { read$j as getAvailableAmount };
}

declare namespace index$8 {
  export { read$i as read };
}

type ReadGetAvailableAmountParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
    terms: Hex;
};
declare const read$h: ({ client, contractAddress, delegationManager, delegationHash, terms, }: ReadGetAvailableAmountParameters) => Promise<{
    availableAmount: bigint;
}>;

declare namespace read$g {
  export { read$h as getAvailableAmount };
}

declare namespace index$7 {
  export { read$g as read };
}

type ReadGetSpentAmountParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
};
declare const read$f: ({ client, contractAddress, delegationManager, delegationHash, }: ReadGetSpentAmountParameters) => Promise<bigint>;

type ReadGetTermsInfoParameters$2 = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
declare const read$e: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters$2) => Promise<bigint>;

declare namespace read$d {
  export { read$f as getSpentAmount, read$e as getTermsInfo };
}

declare namespace index$6 {
  export { read$d as read };
}

type SimulateIncrementNonceParameters = {
    client: Client<Transport, Chain, Account>;
    contractAddress: Address;
    delegationManager: Address;
};
declare const encode$a: (delegationManager: Address) => `0x${string}`;
declare const simulate$a: ({ client, contractAddress, delegationManager, }: SimulateIncrementNonceParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "function";
    readonly name: "afterAllHook";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "afterHook";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "beforeAllHook";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "beforeHook";
    readonly inputs: readonly [{
        readonly name: "_terms";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "_mode";
        readonly type: "bytes32";
        readonly internalType: "ModeCode";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_delegator";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "currentNonce";
    readonly inputs: readonly [{
        readonly name: "delegationManager";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "nonce";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getTermsInfo";
    readonly inputs: readonly [{
        readonly name: "_terms";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "nonce_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "incrementNonce";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "UsedNonce";
    readonly inputs: readonly [{
        readonly name: "delegationManager";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "delegator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}], "incrementNonce", [`0x${string}`], Chain, Account, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "incrementNonce";
    readonly inputs: readonly [{
        readonly name: "_delegationManager";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], Account>>;
declare const execute$a: ({ client, contractAddress, delegationManager, }: SimulateIncrementNonceParameters) => Promise<`0x${string}`>;

declare namespace encode$9 {
  export { encode$a as incrementNonce };
}

declare namespace execute$9 {
  export { execute$a as incrementNonce };
}

type ReadCurrentNonceParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegator: Address;
};
declare const read$c: ({ client, contractAddress, delegationManager, delegator, }: ReadCurrentNonceParameters) => Promise<bigint>;

type ReadGetTermsInfoParameters$1 = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
declare const read$b: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters$1) => Promise<bigint>;

declare namespace read$a {
  export { read$c as currentNonce, read$b as getTermsInfo };
}

declare namespace simulate$9 {
  export { simulate$a as incrementNonce };
}

declare namespace index$5 {
  export { encode$9 as encode, execute$9 as execute, read$a as read, simulate$9 as simulate };
}

type ReadGetOwnerParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$9: ({ client, contractAddress, }: ReadGetOwnerParameters) => Promise<`0x${string}`>;

type ReadGetPendingOwnerParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$8: ({ client, contractAddress, }: ReadGetPendingOwnerParameters) => Promise<`0x${string}`>;

declare namespace read$7 {
  export { read$9 as getOwner, read$8 as getPendingOwner };
}

type SimulateAcceptOwnershipParameters = {
    client: Client;
    contractAddress: Address;
};
type ExecuteAcceptOwnershipParameters = {
    client: InitializedClient;
    contractAddress: Address;
};
declare const simulate$8: ({ client, contractAddress, }: SimulateAcceptOwnershipParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}], "acceptOwnership", readonly [], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const execute$8: ({ client, contractAddress, }: ExecuteAcceptOwnershipParameters) => Promise<`0x${string}`>;
declare const encode$8: () => `0x${string}`;

type SimulateRenounceOwnershipParameters = {
    client: Client;
    contractAddress: Address;
};
type ExecuteRenounceOwnershipParameters = {
    client: InitializedClient;
    contractAddress: Address;
};
declare const simulate$7: ({ client, contractAddress, }: SimulateRenounceOwnershipParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}], "renounceOwnership", readonly [], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const execute$7: ({ client, contractAddress, }: ExecuteRenounceOwnershipParameters) => Promise<`0x${string}`>;
declare const encode$7: () => `0x${string}`;

type SimulateTransferOwnershipParameters = {
    client: Client;
    contractAddress: Address;
    account: Address;
};
type ExecuteTransferOwnershipParameters = {
    client: InitializedClient;
    contractAddress: Address;
    account: Address;
};
declare const simulate$6: ({ client, contractAddress, account, }: SimulateTransferOwnershipParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "function";
    readonly name: "acceptOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "pendingOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferStarted";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "OwnableInvalidOwner";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OwnableUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
}], "transferOwnership", [`0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const execute$6: ({ client, contractAddress, account, }: ExecuteTransferOwnershipParameters) => Promise<`0x${string}`>;
declare const encode$6: (account: Address) => `0x${string}`;

declare namespace execute$5 {
  export { execute$8 as acceptOwnership, execute$7 as renounceOwnership, execute$6 as transferOwnership };
}

declare namespace encode$5 {
  export { encode$8 as acceptOwnership, encode$7 as renounceOwnership, encode$6 as transferOwnership };
}

declare namespace simulate$5 {
  export { simulate$8 as acceptOwnership, simulate$7 as renounceOwnership, simulate$6 as transferOwnership };
}

declare namespace index$4 {
  export { encode$5 as encode, execute$5 as execute, read$7 as read, simulate$5 as simulate };
}

type ReadIsPausedParameters = {
    client: Client;
    contractAddress: Address;
};
declare const read$6: ({ client, contractAddress, }: ReadIsPausedParameters) => Promise<boolean>;

declare namespace read$5 {
  export { read$6 as isPaused };
}

type SimulatePauseParameters = {
    client: Client;
    contractAddress: Address;
};
type ExecutePauseParameters = {
    client: InitializedClient;
    contractAddress: Address;
};
declare const simulate$4: ({ client, contractAddress, }: SimulatePauseParameters) => Promise<viem.SimulateContractReturnType<{
    type: string;
    name: string;
    inputs: never[];
    outputs: never[];
    stateMutability: string;
}[], "pause", readonly unknown[], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$4: ({ client, contractAddress, }: ExecutePauseParameters) => Promise<`0x${string}`>;
declare const encode$4: () => `0x${string}`;

type SimulateUnpauseParameters = {
    client: Client;
    contractAddress: Address;
};
type ExecuteUnpauseParameters = {
    client: InitializedClient;
    contractAddress: Address;
};
declare const simulate$3: ({ client, contractAddress, }: SimulateUnpauseParameters) => Promise<viem.SimulateContractReturnType<{
    type: string;
    name: string;
    inputs: never[];
    outputs: never[];
    stateMutability: string;
}[], "unpause", readonly unknown[], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [never], viem.Account | undefined>>;
declare const execute$3: ({ client, contractAddress, }: ExecuteUnpauseParameters) => Promise<`0x${string}`>;
declare const encode$3: () => `0x${string}`;

declare namespace execute$2 {
  export { execute$4 as pause, execute$3 as unpause };
}

declare namespace encode$2 {
  export { encode$4 as pause, encode$3 as unpause };
}

declare namespace simulate$2 {
  export { simulate$4 as pause, simulate$3 as unpause };
}

declare namespace index$3 {
  export { encode$2 as encode, execute$2 as execute, read$5 as read, simulate$2 as simulate };
}

type SimulateCreate2DeployParameters = {
    client: Client;
    factoryAddress: Address;
    creationCode: Hex;
    salt: Hex;
};
type ExecuteCreate2DeployParameters = {
    client: InitializedClient;
    factoryAddress: Address;
    creationCode: Hex;
    salt: Hex;
};
declare const simulate$1: ({ client, factoryAddress, creationCode, salt, }: SimulateCreate2DeployParameters) => Promise<viem.SimulateContractReturnType<readonly [{
    readonly type: "function";
    readonly name: "computeAddress";
    readonly inputs: readonly [{
        readonly name: "_bytecodeHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "deploy";
    readonly inputs: readonly [{
        readonly name: "_bytecode";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "_salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Deployed";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "Create2EmptyBytecode";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Create2FailedDeployment";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Create2InsufficientBalance";
    readonly inputs: readonly [{
        readonly name: "balance";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "needed";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "SimpleFactoryEmptyContract";
    readonly inputs: readonly [{
        readonly name: "deployed";
        readonly type: "address";
        readonly internalType: "address";
    }];
}], "deploy", [`0x${string}`, `0x${string}`], viem.Chain | undefined, viem.Account | undefined, undefined, undefined, readonly [{
    readonly type: "function";
    readonly name: "deploy";
    readonly inputs: readonly [{
        readonly name: "_bytecode";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "_salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}], viem.Account | undefined>>;
declare const encode$1: (creationCode: Hex, salt: Hex) => `0x${string}`;
declare const execute$1: ({ client, factoryAddress, creationCode, salt, }: ExecuteCreate2DeployParameters) => Promise<`0x${string}`>;

declare namespace encode {
  export { encode$1 as create2Deploy };
}

declare namespace execute {
  export { execute$1 as create2Deploy };
}

declare const read$4: (client: Client, factoryAddress: Address, creationCode: Hex, salt: Hex) => Promise<`0x${string}`>;

declare namespace read$3 {
  export { read$4 as getCreate2Address };
}

declare namespace simulate {
  export { simulate$1 as create2Deploy };
}

declare const index$2_encode: typeof encode;
declare const index$2_execute: typeof execute;
declare const index$2_simulate: typeof simulate;
declare namespace index$2 {
  export { index$2_encode as encode, index$2_execute as execute, read$3 as read, index$2_simulate as simulate };
}

type ReadGetTermsInfoParameters = {
    client: Client;
    contractAddress: Address;
    terms: Hex;
};
type TermsData = {
    tokenAddress: Address;
    recipient: Address;
    amount: bigint;
    firstTarget: Address;
    firstCalldata: Hex;
};
declare const read$2: ({ client, contractAddress, terms, }: ReadGetTermsInfoParameters) => Promise<TermsData>;

type ReadUsedDelegationsParameters = {
    client: Client;
    contractAddress: Address;
    delegationManager: Address;
    delegationHash: Hex;
};
declare const read$1: ({ client, contractAddress, delegationManager, delegationHash, }: ReadUsedDelegationsParameters) => Promise<boolean>;

declare namespace read {
  export { read$2 as getTermsInfo, read$1 as usedDelegations };
}

declare const index$1_read: typeof read;
declare namespace index$1 {
  export { index$1_read as read };
}

type index_InitializedClient = InitializedClient;
type index_NarrowAbiToFunction<TAbi extends Abi, FunctionName extends string> = NarrowAbiToFunction<TAbi, FunctionName>;
type index_P256Owner = P256Owner;
declare const index_Redemption: typeof Redemption;
declare const index_encodeProxyCreationCode: typeof encodeProxyCreationCode;
declare const index_isContractDeployed: typeof isContractDeployed;
declare const index_isImplementationExpected: typeof isImplementationExpected;
declare namespace index {
  export { index$j as DeleGatorCore, index$k as DelegationManager, index$i as EIP712, index$g as ERC20PeriodTransferEnforcer, index$f as ERC20StreamingEnforcer, index$e as ERC20TransferAmountEnforcer, index$h as EntryPoint, index$d as HybridDeleGator, index$c as IdEnforcer, type index_InitializedClient as InitializedClient, index$b as LimitedCallsEnforcer, index$a as MultiSigDeleGator, index$9 as MultiTokenPeriodEnforcer, type index_NarrowAbiToFunction as NarrowAbiToFunction, index$8 as NativeTokenPeriodTransferEnforcer, index$7 as NativeTokenStreamingEnforcer, index$6 as NativeTokenTransferAmountEnforcer, index$5 as NonceEnforcer, index$4 as Ownable2Step, type index_P256Owner as P256Owner, index$3 as Pausable, index_Redemption as Redemption, index$2 as SimpleFactory, index$1 as SpecificActionERC20TransferBatchEnforcer, index_encodeProxyCreationCode as encodeProxyCreationCode, index_isContractDeployed as isContractDeployed, index_isImplementationExpected as isImplementationExpected };
}

export { type InitializedClient as I, type NarrowAbiToFunction as N, type P256Owner as P, index$k as a, index$j as b, index$i as c, index$h as d, index$d as e, index$c as f, index$b as g, index$a as h, index as i, index$5 as j, index$4 as k, index$3 as l, index$2 as m, index$1 as n, index$g as o, index$f as p, index$e as q, index$9 as r, index$8 as s, index$7 as t, index$6 as u, isContractDeployed as v, isImplementationExpected as w, encodeProxyCreationCode as x };
