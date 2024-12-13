import { getReferenda } from "@/actions/get-referenda"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

import { FormSendout } from "./form-sendout"

const revalidate = 10800 // revalidate at most every 3 hours

export default async function SendoutPage() {
  const referenda = await getReferenda()
  console.log(referenda)

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
