import { Suspense } from "react"
import { type Metadata } from "next"
import dynamic from "next/dynamic"
import Script from "next/script"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import SectionWeb3Thinkers from "@/components/sections/section-web3-thinkers"

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

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchLatestVideos(THE_KUS_PLAYLIST_ID)
  const lcpImageUrl = data?.videos?.[0]?.thumbnails?.maxres?.url
  return {
    other: lcpImageUrl
      ? {
          "preload-lcp-image": `<link rel=\"preload\" href=\"${lcpImageUrl}\" as=\"image\" type=\"image/jpeg\" />`,
        }
      : {},
  }
}

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
        <SectionAAG />
        <SectionWeb3Thinkers />
        {/* <Faqs /> */}
      </main>
      <Footer />
      <Script id="adrsbl-pixel" strategy="afterInteractive">
        {`
!function(w, d){
    w.__adrsbl = {
        queue: [],
        run: function(){
            this.queue.push(arguments);
        }
    };
    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://tag.adrsbl.io/p.js?tid=a5cdcfe34baf4c25ab0e4974a4390210';
    var b = d.getElementsByTagName('script')[0];
    b.parentNode.insertBefore(s, b);
}(window, document);
        `}
      </Script>
    </>
  )
}
