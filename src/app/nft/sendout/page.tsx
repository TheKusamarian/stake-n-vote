import { getReferenda } from "@/actions/get-referenda"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSendout } from "@/app/nft/sendout/form-sendout"

export const revalidate = 60 // revalidate at most every 60 seconds

export default async function SendoutPage() {
  const referenda = await getReferenda()

  return (
    <div>
      <Header />
      <main className="min-h-screen mt-28 p-20">
        <FormSendout referenda={referenda.data || []} />
      </main>
      <Footer />
    </div>
  )
}
