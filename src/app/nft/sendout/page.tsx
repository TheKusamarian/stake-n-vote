import { Suspense } from "react"
import { type Metadata } from "next"
import { Loader2 } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSendout } from "@/app/nft/sendout/form-sendout"

export const revalidate = 60

export const metadata: Metadata = {
  title: "NFT Sendout",
  description: "Send out NFTs to OpenGOV referendum participants",
}

export default async function SendoutPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen my-28">
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          }
        >
          <FormSendout />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
