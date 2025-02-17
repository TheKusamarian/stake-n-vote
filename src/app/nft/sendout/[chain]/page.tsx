import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getReferenda } from "@/actions/get-referenda"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSendout } from "@/app/nft/sendout/form-sendout"

export const revalidate = 60

type Props = {
  params: { chain: string }
}

// Validate supported chains
const supportedChains = ["polkadot", "kusama"] as const
type SupportedChain = (typeof supportedChains)[number]

function isValidChain(chain: string): chain is SupportedChain {
  return supportedChains.includes(chain as SupportedChain)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chain = params.chain.toLowerCase()
  if (!isValidChain(chain)) return notFound()

  const chainName = chain.charAt(0).toUpperCase() + chain.slice(1)
  return {
    title: `${chainName} NFT Sendout`,
    description: `Sendout NFTs to Referendum Participants in ${chainName}`,
  }
}

export async function generateStaticParams() {
  return supportedChains.map((chain) => ({ chain }))
}

export default async function SendoutPage({ params }: Props) {
  return (
    <div>
      <Header />
      <main className="min-h-screen my-28">
        <FormSendout />
      </main>
      <Footer />
    </div>
  )
}
