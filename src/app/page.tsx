import { Suspense } from "react"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { CallToAction } from "@/components/CallToAction"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { PrimaryFeatures } from "@/components/PrimaryFeatures"
import { SectionSpaceMonkeys } from "@/components/sections/section-space-monkeys"
import { SectionTheKus } from "@/components/sections/section-the-kus"

export const revalidate = 10800 // revalidate at most every 3 hours

const THE_KUS_PLAYLIST_ID = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"

export default async function Home() {
  const data = await fetchLatestVideos(THE_KUS_PLAYLIST_ID)

  return (
    <>
      <Header />
      <main>
        <Hero video={data?.videos?.[0]} />
        <Suspense fallback={<div>Loading...</div>}>
          <PrimaryFeatures />
        </Suspense>
        <SectionTheKus data={data} />
        <CallToAction />
        <SectionSpaceMonkeys />
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  )
}
