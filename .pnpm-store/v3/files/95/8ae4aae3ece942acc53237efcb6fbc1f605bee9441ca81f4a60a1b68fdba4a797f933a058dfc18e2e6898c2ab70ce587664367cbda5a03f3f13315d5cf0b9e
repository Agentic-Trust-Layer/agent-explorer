import { WalletClient, PublicClient, Chain, Hex } from 'viem';
import { D as DeleGatorEnvironment } from './types-DXRahfjU.js';

type SupportedVersion = '1.0.0' | '1.1.0' | '1.2.0' | '1.3.0';
declare const PREFERRED_VERSION: SupportedVersion;
declare function overrideDeployedEnvironment(chainId: number, version: SupportedVersion, environment: DeleGatorEnvironment): void;
declare function getDeleGatorEnvironment(chainId: number, version?: SupportedVersion): DeleGatorEnvironment;
declare function deployDeleGatorEnvironment(walletClient: WalletClient, publicClient: PublicClient, chain: Chain, deployedContracts?: {
    [contract: string]: Hex;
}): Promise<DeleGatorEnvironment>;

export { PREFERRED_VERSION as P, deployDeleGatorEnvironment as d, getDeleGatorEnvironment as g, overrideDeployedEnvironment as o };
