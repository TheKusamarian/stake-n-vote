/**
 * Substrate Chain Type
 */
interface SubstrateChain {
    network: string;
    name: string;
    rpcUrls: [string, ...string[]];
    ss58Prefix?: number;
    explorerUrls?: Partial<Record<SubstrateExplorer, string>>;
    testnet?: boolean;
    faucetUrls?: string[];
}
declare enum SubstrateExplorer {
    Subscan = "subscan",
    PolkadotJs = "polkadotjs",
    Other = "other"
}

export { type SubstrateChain as S, SubstrateExplorer as a };
