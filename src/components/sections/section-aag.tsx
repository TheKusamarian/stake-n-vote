import { ReactElement, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { YoutubeIcon } from "@/icons"
import backgroundImage from "@/images/space-monkeys.webp"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { Button } from "../ui/button"
import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

const AAG_PLAYLIST_ID = "PLtyd7v_I7PGkXbJmKojrZ1KXwspR1JkpV"

export default async function SectionAAG() {
  const data = await fetchLatestVideos(AAG_PLAYLIST_ID)

  const extractGoogleDocsLink = (text: string): React.ReactElement | null => {
    const regex =
      /https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+\/edit/g
    const matches = text.match(regex)

    if (matches) {
      return (
        <a
          href={matches[0]}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the AAGenda
        </a>
      )
    }

    return null
  }

  return (
    <section
      className="py-16 relative bg-[#ff2268] bg-[url('/aag.png')]"
      //   style={{
      //     backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M40 45a5 5 0 110-10 5 5 0 010 10zM0 45a5 5 0 110-10 5 5 0 010 10zM0 5A5 5 0 110-5 5 5 0 010 5zm40 0a5 5 0 110-10 5 5 0 010 10z'  stroke-width='3' stroke='hsla(341, 100%, 57%, 1)' fill='none'/><path d='M20 25a5 5 0 110-10 5 5 0 010 10z'  stroke-width='3' stroke='hsla(341, 100%, 57%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
      //   }}
    >
      <div className="container mx-auto px-4 z-1 mb-10 relative">
        <h2 className="text-5xl font-bold text-center mb-4">
          Attempts at Governance (AAG)
        </h2>
        <p className="text-center mb-16">
          The twice-weekly live public forum where treasury & software proposals
          are put in the hot seat!
        </p>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid
            videos={data?.videos}
            className=""
            classNames={{
              item: "backdrop-blur-md bg-transparent border border-gray-900 shadow-xl",
            }}
            descriptionFn={extractGoogleDocsLink}
          />
        </Suspense>
        <div className="flex w-full justify-center mt-8">
          <Button className="mt-8">
            <Link
              className="flex"
              href={`https://www.youtube.com/playlist?list=${AAG_PLAYLIST_ID}`}
            >
              <YoutubeIcon className="mr-2" /> View all Attempts on Governance
              videos on YouTube
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
