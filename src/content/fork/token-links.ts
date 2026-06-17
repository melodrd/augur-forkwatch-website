import { REP_TOKENS } from "@/domain/tokens/rep-tokens";

export const tokenGroups = [
  {
    links: [
      {
        href: `https://etherscan.io/token/${REP_TOKENS.repV1.address}`,
        label: "Etherscan",
      },
    ],
    title: REP_TOKENS.repV1.symbol,
  },
  {
    links: [
      {
        href: `https://etherscan.io/token/${REP_TOKENS.repV2.address}`,
        label: "Etherscan",
      },
      {
        href: `https://app.uniswap.org/explore/tokens/ethereum/${REP_TOKENS.repV2.address}`,
        label: "Uniswap",
      },
    ],
    title: REP_TOKENS.repV2.symbol,
  },
  {
    links: [
      {
        href: `https://etherscan.io/token/${REP_TOKENS.repV2Yes1.address}`,
        label: "Etherscan",
      },
      {
        href: `https://app.uniswap.org/explore/tokens/ethereum/${REP_TOKENS.repV2Yes1.address}`,
        label: "Uniswap",
      },
    ],
    title: REP_TOKENS.repV2Yes1.symbol,
  },
] as const;
