import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getReferenda } from "@/actions/get-referenda"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSendout } from "@/app/nft/sendout/form-sendout"

export const revalidate = 60

export default async function SendoutPage() {
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
