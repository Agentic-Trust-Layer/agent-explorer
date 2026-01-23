import { WalletClient, PublicClient, Chain, Hex } from 'viem';
import { S as SmartAccountsEnvironment } from './types-Bwksz_U6.cjs';

type SupportedVersion = '1.0.0' | '1.1.0' | '1.2.0' | '1.3.0';
declare const PREFERRED_VERSION: SupportedVersion;
declare function overrideDeployedEnvironment(chainId: number, version: SupportedVersion, environment: SmartAccountsEnvironment): void;
declare function getSmartAccountsEnvironment(chainId: number, version?: SupportedVersion): SmartAccountsEnvironment;
declare function deploySmartAccountsEnvironment(walletClient: WalletClient, publicClient: PublicClient, chain: Chain, deployedContracts?: {
    [contract: string]: Hex;
}): Promise<SmartAccountsEnvironment>;

export { PREFERRED_VERSION as P, deploySmartAccountsEnvironment as d, getSmartAccountsEnvironment as g, overrideDeployedEnvironment as o };
