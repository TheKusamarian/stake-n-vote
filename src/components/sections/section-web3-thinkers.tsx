import { Suspense } from "react"
import Link from "next/link"
import { YoutubeIcon } from "@/icons"

import { fetchLatestVideos } from "@/lib/fetch-latest-videos"
import { VideoGrid } from "@/components/videos/VideoGrid"

import { Button } from "../ui/button"
import { VideoGridSkeleton } from "../videos/ViedeoGridSkeleton"

const OPEN_DEV_PLAYLIST_ID = "PLtyd7v_I7PGnko80O0LCwQQsvhwAMu9cv"

function extractThirdParagraph(description: string) {
  const paragraphs = description.split("\n\n")
  const paragraph = paragraphs[1] || paragraphs[0] || ""
  return <>{paragraph}</>
}

export default async function SectionWeb3Thinkers() {
  const data = await fetchLatestVideos(OPEN_DEV_PLAYLIST_ID)
  return (
    <section
      className="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-900 py-20"
      id="open-dev"
    >
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-5xl font-bold text-center mb-4 text-white ">
          Web3 Thinkers
        </h2>
        <p className="text-center mb-16 text-white">
          Behind the code of Web3. Dive into underlying technologies and
          concepts of the decentralized web in interesting conversations with
          the people building it.
        </p>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid
            videos={data?.videos}
            descriptionFn={extractThirdParagraph}
          />
        </Suspense>
        <div className="flex w-full justify-center mt-8">
          <Button className="mt-8">
            <Link
              className="flex"
              href={`https://www.youtube.com/playlist?list=${OPEN_DEV_PLAYLIST_ID}`}
            >
              <YoutubeIcon className="mr-2" /> View all Web3 Thinkers videos on
              YouTube
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
