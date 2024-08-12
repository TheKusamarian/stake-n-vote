import { Suspense } from "react"
import dynamic from "next/dynamic"
import Head from "next/head"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { Footer } from "@/components/_footer"
import { Header } from "@/components/_header"
import { Hero } from "@/components/_hero"
import { CallToAction } from "@/components/call-to-action"

// Dynamically import non-critical components
const PrimaryFeatures = dynamic(() => import("@/components/primary-featurs"), {
  suspense: true,
})
const SectionSpaceMonkeys = dynamic(
  () => import("@/components/sections/section-space-monkeys")
)
const SectionTheKus = dynamic(
  () => import("@/components/sections/section-the-kus")
)
const SectionAAG = dynamic(() => import("@/components/sections/section-aag"))

export const revalidate = 10800 // revalidate at most every 3 hours

const THE_KUS_PLAYLIST_ID = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"

export default async function Home() {
  const data = await fetchLatestVideos(THE_KUS_PLAYLIST_ID)
  const lcpImageUrl = data?.videos?.[0]?.thumbnails?.maxres?.url

  return (
    <>
      <Head>
        {lcpImageUrl && (
          <link rel="preload" href={lcpImageUrl} as="image" type="image/jpeg" />
        )}
      </Head>
      <Header />
      <main>
        <Hero video={data?.videos?.[0]} />
        <Suspense fallback={<div>Loading...</div>}>
          <PrimaryFeatures />
        </Suspense>
        <SectionTheKus data={data} />
        <CallToAction />
        <SectionSpaceMonkeys />
        <SectionAAG />
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  )
}
