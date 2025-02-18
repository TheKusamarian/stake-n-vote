import Link from "next/link"
import { BN } from "@polkadot/util"
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  PartyPopper,
  Share,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function SuccessView({
  totalMinted,
  referendumId,
}: {
  totalMinted: string
  referendumId: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="text-center mb-8">
        <div className="inline-block p-4 rounded-full bg-green-50 mb-6">
          <PartyPopper className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
          NFTs Successfully Minted!
        </h1>
        <p className="text-gray-600 text-lg">
          You&apos;ve just minted and distributed NFTs to referendum
          participants
        </p>
      </div>

      <Alert className="mb-4 border-green-200 bg-green-50 p-8">
        <AlertTitle className="text-green-800">Transaction Complete</AlertTitle>
        <AlertDescription className="text-green-700 flex items-center   ">
          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 stroke-green-500 inline-block" />
          {totalMinted} NFTs have been minted and distributed to aye voters of
          Referendum #{referendumId}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 text-center flex flex-col items-center p-4 group hover:border-pink-500 hover:shadow-lg transition-all duration-300"
          onClick={() => {}}
        >
          <div className="font-semibold mb-1 flex items-center">
            View NFTs
            <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-sm text-gray-500">
            Check out the minted collection
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-20 text-center flex flex-col items-center p-4 group hover:border-purple-500 hover:shadow-lg transition-all duration-300"
          onClick={() => {}}
        >
          <div className="font-semibold mb-1 flex items-center">
            Share Results
            <Share className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-sm text-gray-500">Share this distribution</div>
        </Button>
      </div>

      <div className="mt-8 text-center w-full items-center flex justify-center">
        <Link href="/nft/sendout">
          <Button className="hover:shadow-lg transition-all duration-300">
            Start New Sendout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
